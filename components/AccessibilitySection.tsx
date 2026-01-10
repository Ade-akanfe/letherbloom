"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AccessibilitySection() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Our Philosophy
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900">
              Fitness Should Be{" "}
              <span className="text-rose-600">Accessible</span> to Everyone
            </h2>
            <p className="mt-6 text-lg text-zinc-700">
              Whether you're a complete beginner or an experienced lifter, we
              have a variety of equipment and classes to build your skills. Join
              a thriving community dedicated to your success.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Expert coaches with years of experience",
                "Flexible schedules that work with your life",
                "Supportive community of women lifters",
                "Form-first approach to prevent injury",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-zinc-700">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-2xl bg-linear-to-br from-rose-100 to-rose-50 p-12 text-center flex flex-col items-center justify-center">
              <Image
                src="/training-woman.svg"
                alt="Woman doing upper body training"
                width={200}
                height={200}
                className="h-48 w-48 object-contain mb-4"
              />
              <p className="text-zinc-700">
                Build the strength and confidence to achieve your goals, both in
                the gym and in life.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
