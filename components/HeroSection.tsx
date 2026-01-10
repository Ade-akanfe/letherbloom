"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-rose-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="grid gap-12 md:grid-cols-2 md:items-center w-full lg:gap-16">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-widest text-rose-600 md:text-base">
                    Achieve Your Fitness Goals
                  </p>
                  <h1 className="text-5xl font-black leading-tight text-zinc-900 md:text-6xl lg:text-7xl xl:text-8xl">
                    Find Your <span className="text-rose-600">Strength</span>
                  </h1>
                </div>

                <p className="max-w-lg text-lg text-zinc-600 md:text-xl lg:text-2xl">
                  Inside and out. Build confidence, strength, and community with
                  workouts designed specifically for women.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/live-training"
                    className="rounded-full bg-rose-600 px-8 py-4 font-semibold text-white shadow-lg md:px-10 md:py-5 md:text-lg transition-opacity hover:opacity-90 active:opacity-80"
                  >
                    Join Now
                  </Link>
                  <button
                    className="rounded-full border-2 border-rose-600 px-8 py-4 font-semibold text-rose-600 md:px-10 md:py-5 md:text-lg transition-opacity hover:opacity-90 active:opacity-80"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-96 md:h-[500px] lg:h-[650px] xl:h-[550px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-200 to-rose-100 opacity-60 blur-3xl" />
                <Image
                  src="/image-hero.png"
                  alt="Woman doing upper body training"
                  width={1500}
                  height={1500}
                  className="relative h-full w-full object-cover rounded-lg object-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute right-10 top-10 text-rose-200 text-6xl">
          ✦
        </div>
      </motion.div>
    </section>
  );
}
