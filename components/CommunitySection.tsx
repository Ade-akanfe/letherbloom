"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CommunitySection() {
    return (
        <section className="bg-rose-50 py-20 text-zinc-900 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="absolute -inset-4 bg-white rounded-full opacity-60 blur-3xl"></div>
                        <div className="relative aspect-square w-full overflow-hidden rounded-full border-8 border-white shadow-xl">
                            <Image
                                src="/images/Gemini_Generated_Image_jxnb8sjxnb8sjxnb.png"
                                alt="Community of women"
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
                        <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                            Stronger <span className="text-rose-600">Together</span>
                        </h2>
                        <p className="mt-6 text-lg text-zinc-700 md:text-xl leading-relaxed">
                            You are never alone on this journey. Join a vibrant community of supportive women who cheer for your every win. We celebrate diversity, encourage progress, and lift each other up every single day.
                        </p>
                        <p className="mt-4 text-lg text-zinc-700 md:text-xl leading-relaxed">
                            From group challenges to shared stories, find the motivation you need to keep going and the friendship to make it fun.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
