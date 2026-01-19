"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OurVisionSection() {
    return (
        <section className="bg-rose-50 py-20 text-zinc-900 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-rose-600 font-semibold tracking-wider uppercase mb-2">Our Vision</div>
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl mb-6">
                            A World Where You <span className="text-rose-600">Bloom</span>
                        </h2>
                        <div className="space-y-6 text-lg text-zinc-700 md:text-xl leading-relaxed">
                            <p>
                                We envision a future where every woman embraces her strength without apology. Where fitness is not a punishment, but a celebration of what your body can do.
                            </p>
                            <p>
                                By combining physical training with mindfulness and community support, we are building a legacy of health that extends far beyond the gym walls. We want you to feel vibrant, centered, and unstoppable.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-rose-200">
                            <p className="font-handwriting text-3xl text-rose-600 rotate-2">
                                "Strong body. Calm mind. Wild heart."
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
                        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-rose-200 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-200 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-xl">
                            <Image
                                src="/images/Gemini_Generated_Image_251cny251cny251c.png"
                                alt="Woman in a state of wellness"
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
