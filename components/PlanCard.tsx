"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import { toast } from "sonner";

interface PlanCardProps {
  name: string;
  description: string;
  price?: string;
  priceNote?: string;
  features?: string[];
  featured?: boolean;
  priceId?: string;
  hasSelector?: boolean;
  eliteDuration?: number;
  onDurationChange?: (duration: number) => void;
  onSelect?: (plan: { name: string; priceId: string }) => void;
  isOrganization?: boolean;
}

export default function PlanCard({
  name,
  description,
  price,
  priceNote,
  features,
  featured = false,
  priceId,
  hasSelector,
  eliteDuration,
  onDurationChange,
  onSelect,
  isOrganization,
}: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleSubscribe = async () => {
    // Handle Organization redirect immediately
    if (isOrganization) {
      window.location.href = "/pricing/organization";
      return;
    }

    // If onSelect is provided (Wizard mode), use it and skip internal flow
    if (onSelect) {
      onSelect({ name, priceId: priceId || "" });
      return;
    }

    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Use passed priceId or fallback to dev placeholder logic if missing
      let finalPriceId = priceId;

      if (!finalPriceId) {
        // Fallback mapping if not provided via props (for safety/dev)
        if (name === "Basic") finalPriceId = "price_1Basic";
        else if (name === "Elite") finalPriceId = "price_1Elite";
        else finalPriceId = "price_test_" + name.replace(/\s+/g, '');
      }

      console.log("Subscribing to:", name, "PriceID:", finalPriceId, "Duration:", eliteDuration);

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: finalPriceId,
          planName: name,
          duration: name === "Elite" ? eliteDuration : undefined
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong sending you to checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onSelect ? () => handleSubscribe() : undefined}
      className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 h-full cursor-pointer ${featured
        ? "border-2 border-rose-600 bg-gradient-to-br from-rose-50 to-white shadow-2xl scale-105 z-10"
        : "border border-zinc-200 bg-white shadow-xl hover:-translate-y-2 hover:shadow-2xl"
        }`}
    >
      <div>
        <h3 className={`text-2xl font-bold ${featured ? "text-rose-600" : "text-zinc-900"}`}>
          {name}
        </h3>
        {price && (
          <div className="mt-4">
            <span className="text-4xl font-black text-zinc-900">${price}</span>
            <span className="text-zinc-600">/{priceNote || "month"}</span>
          </div>
        )}

        {hasSelector && eliteDuration !== undefined && onDurationChange && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 6, 12].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => onDurationChange(months)}
                  className={`px-2 py-1 text-sm rounded-lg font-semibold transition ${eliteDuration === months
                    ? "bg-rose-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                >
                  {months}m
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-zinc-600">{description}</p>

        {features && (
          <ul className="mt-8 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="text-rose-600 shrink-0">✓</span>
                <span className="text-zinc-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        {generatedCode ? (
          <div className="p-3 bg-green-100 text-green-800 rounded text-center">
            <p className="text-xs font-bold uppercase">Access Code:</p>
            <p className="font-mono text-lg">{generatedCode}</p>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe();
            }}
            disabled={isLoading}
            className={`w-full rounded-full py-3 px-6 text-lg font-bold transition-all ${featured
              ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg"
              : "border-2 border-rose-600 text-rose-600 hover:bg-rose-50"
              } disabled:opacity-50`}
          >
            {isLoading ? "Processing..." : `Choose ${name}`}
          </button>
        )}
      </div>
    </div>
  );
}

