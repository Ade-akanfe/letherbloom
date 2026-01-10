"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.article
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      transition={{ duration: 0.6 + delay * 0.1 }}
    >
      <div className="rounded-xl bg-white/60 p-6 shadow">
        <h3 className="mb-2 text-xl font-semibold text-rose-700">{title}</h3>
        <p className="text-sm text-zinc-700">{description}</p>
      </div>
    </motion.article>
  );
}
