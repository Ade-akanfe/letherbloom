"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OurStorySection() {
    return (
        <section className="bg-white py-20 text-zinc-900 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-rose-600 font-semibold tracking-wider uppercase mb-2">Since 2024</div>
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl mb-6">
                            Written by Women, <span className="text-rose-600">for Women</span>
                        </h2>
                        <div className="space-y-4 text-lg text-zinc-600 md:text-xl leading-relaxed">
                            <p>
                                LetHerBloom started with a simple observation: many fitness spaces, while functional, lacked the specific supportive environment that allows women to truly thrive.
                            </p>
                            <p>
                                We wanted to create more than just a gym. We envisioned a sanctuary where the clanging of weights represents the breaking of barriers. A place where you don't just work out; you belong.
                            </p>
                            <p>
                                What began as a small meet-up group has blossomed into a movement, uniting women from all walks of life under one common goal: to be their strongest selves.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl skew-y-3 bg-zinc-100">
                            <Image
                                src="/images/Gemini_Generated_Image_japhwjjaphwjjaph.png"
                                alt="Group of women sharing a moment"
                                fill
                                className="object-cover -skew-y-3 scale-110"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
