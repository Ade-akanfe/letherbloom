"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    "/images/Gemini_Generated_Image_251cny251cny251c.png",
    "/images/Gemini_Generated_Image_8hllxj8hllxj8hll.png",
    "/images/Gemini_Generated_Image_dlwnq7dlwnq7dlwn.png",
    "/images/Gemini_Generated_Image_douzh7douzh7douz.png",
    "/images/Gemini_Generated_Image_f95rxvf95rxvf95r.png",
    "/images/Gemini_Generated_Image_japhwjjaphwjjaph.png",
    "/images/Gemini_Generated_Image_jxnb8sjxnb8sjxnb.png",
    "/images/Gemini_Generated_Image_n8am4in8am4in8am.png",
    "/images/Gemini_Generated_Image_t2jcuot2jcuot2jc.png",
    "/images/Gemini_Generated_Image_tunm5xtunm5xtunm.png",
];

export default function GallerySection() {
    return (
        <section className="bg-rose-50 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-zinc-900 md:text-5xl">
                        Community <span className="text-rose-600">Moments</span>
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600">
                        See our amazing women in action, building strength and confidence together.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className="overflow-hidden rounded-2xl shadow-lg"
                        >
                            <div className="relative aspect-square">
                                <Image
                                    src={src}
                                    alt={`LetHerBloom Moment ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
