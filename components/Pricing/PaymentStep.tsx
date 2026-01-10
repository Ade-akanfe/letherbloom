"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import ThreeDotsLoader from "@/components/ThreeDotsLoader";

// Validate public key exists
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentStepProps {
  plan: { name: string; priceId: string };
  onBack: () => void;
}

export default function PaymentStep({ plan, onBack }: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Create a Checkout Session as soon as the component loads
    fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: plan.priceId,
        planName: plan.name,
        uiMode: "embedded",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [plan]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <ThreeDotsLoader color="bg-rose-600" />
        <p className="mt-4 text-zinc-500 animate-pulse">
          Initializing Secure Checkout...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold mb-4">
          Error loading checkout: {error}
        </p>
        <button onClick={onBack} className="text-rose-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-medium text-zinc-500 hover:text-rose-600 transition-colors"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Plans
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Checkout</h3>
            <p className="text-sm text-zinc-500">
              Completing purchase for{" "}
              <span className="font-semibold text-rose-600">{plan.name}</span>
            </p>
          </div>
          <div className="text-xs font-mono bg-zinc-200 px-2 py-1 rounded text-zinc-600">
            Secure SSL
          </div>
        </div>

        <div className="p-1">
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="min-h-125" />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
