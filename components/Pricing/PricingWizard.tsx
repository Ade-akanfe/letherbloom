"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlansSection from "@/components/PlansSection";
import PaymentStep from "@/components/Pricing/PaymentStep";

export default function PricingWizard() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; priceId: string } | null>(null);

    const handleSelectPlan = (plan: { name: string; priceId: string }) => {
        setSelectedPlan(plan);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(1);
        setSelectedPlan(null);
    };

    return (
        <div className="">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PlansSection onSelect={handleSelectPlan} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedPlan && (
                            <PaymentStep plan={selectedPlan} onBack={handleBack} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
