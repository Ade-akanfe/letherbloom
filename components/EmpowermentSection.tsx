"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function EmpowermentSection() {
    return (
        <section className="bg-white py-20 text-zinc-900 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                            Bloom Where You Are <span className="text-rose-600">Planted</span>
                        </h2>
                        <p className="mt-6 text-lg text-zinc-600 md:text-xl leading-relaxed">
                            It doesn't matter where you start—it matters that you start. Our programs are designed to meet you at your current fitness level and guide you to your peak potential.
                        </p>
                        <ul className="mt-6 space-y-4">
                            {['Personalized Training Plans', 'Nutritional Guidance', 'Mindset Coaching'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-medium text-zinc-800">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10">
                            <Link
                                href="/live-training"
                                className="rounded-full bg-zinc-900 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-zinc-800 active:scale-95"
                            >
                                Start Your Transformation
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative h-[500px] w-full overflow-hidden rounded-tr-[100px] rounded-bl-[100px] border-zinc-100 bg-zinc-100 shadow-2xl">
                            <Image
                                src="/images/Gemini_Generated_Image_dlwnq7dlwnq7dlwn.png"
                                alt="Confident woman training"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Floating element */}
                        <div className="absolute -bottom-10 -left-10 z-10 hidden md:block">
                            <div className="rounded-2xl bg-white p-6 shadow-xl">
                                <p className="text-4xl font-black text-rose-600">100%</p>
                                <p className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Commitment</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
