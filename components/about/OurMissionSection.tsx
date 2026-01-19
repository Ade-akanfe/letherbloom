"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OurMissionSection() {
    return (
        <section className="bg-zinc-900 py-24 text-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="absolute inset-0 bg-rose-500 rounded-full opacity-20 blur-3xl translate-x-10 translate-y-10"></div>
                        <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-full overflow-hidden rounded-tl-[100px] rounded-br-[100px] border-4 border-zinc-700 shadow-2xl">
                            <Image
                                src="/images/Gemini_Generated_Image_douzh7douzh7douz.png"
                                alt="Upper body training in action"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <div className="text-rose-400 font-semibold tracking-wider uppercase mb-2">Our Mission</div>
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl mb-8">
                            Redefining <span className="text-rose-400">Strength</span>
                        </h2>
                        <p className="text-lg text-zinc-300 md:text-xl leading-relaxed mb-8">
                            Our mission is to empower you to feel capable in every aspect of your life. We focus heavily on **functional upper body strength**—often neglected but essential for posture, confidence, and daily power.
                        </p>

                        <div className="grid gap-6">
                            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
                                <h3 className="text-xl font-bold text-white mb-2">Sculpt & Tone</h3>
                                <p className="text-zinc-400">Targeted exercises to define your arms, shoulders, and back, creating a strong, elegant silhouette.</p>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
                                <h3 className="text-xl font-bold text-white mb-2">Posture Perfection</h3>
                                <p className="text-zinc-400">Correct imbalances from daily life. Stand taller, breathe better, and radiate confidence.</p>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
                                <h3 className="text-xl font-bold text-white mb-2">Functional Power</h3>
                                <p className="text-zinc-400">Build the strength you need for real life—lifting, carrying, and moving with ease.</p>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}
