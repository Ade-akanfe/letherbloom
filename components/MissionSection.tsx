"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MissionSection() {
  return (
    <section className="bg-zinc-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
          <div className="mb-6 text-6xl md:text-7xl">✦</div>
          <h2 className="text-5xl font-black leading-tight md:text-6xl">
            Your Body is <span className="text-rose-400">Your Temple</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-300">
            Strength training isn't just about looking good. It's about feeling
            powerful, capable, and confident in everything you do. We help you
            build strength that transcends the gym.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/live-training"
              className="mt-8 inline-block rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-zinc-900"
            >
              Start Your Journey
            </Link>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
