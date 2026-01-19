"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PhilosophySection() {
    return (
        <section className="bg-zinc-900 py-20 text-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-rose-400 text-6xl mb-6">✦</div>
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                            Your Body is Your <span className="text-rose-400">Temple</span>
                        </h2>
                        <p className="mt-6 text-lg text-zinc-300 md:text-xl leading-relaxed">
                            Strength isn't just physical. It's the mental fortitude to push through barriers, the confidence to stand tall, and the resilience to bloom in any season. We believe in holistic training that nurtures both the body and the mind.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/about"
                                className="rounded-full bg-rose-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-rose-700 active:scale-95"
                            >
                                Our Philosophy
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-rose-500 rounded-3xl rotate-3 opacity-20 blur-2xl"></div>
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-zinc-800 shadow-2xl">
                            <Image
                                src="/images/Gemini_Generated_Image_8hllxj8hllxj8hll.png"
                                alt="Woman meditating and training"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
