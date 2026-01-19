import Image from "next/image";
import OurStorySection from "@/components/about/OurStorySection";
import OurMissionSection from "@/components/about/OurMissionSection";
import OurVisionSection from "@/components/about/OurVisionSection";
import GallerySection from "@/components/GallerySection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="bg-white font-sans text-foreground">
            <Navigation />

            {/* Hero for About Page */}
            <section className="relative bg-rose-900 py-24 text-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-black leading-tight md:text-7xl">
                            About <span className="text-rose-400">LetHerBloom</span>
                        </h1>
                        <p className="mt-6 text-xl text-rose-100 md:text-2xl">
                            Empowering women through strength, community, and holistic wellness.
                        </p>
                    </div>
                </div>
                <div className="absolute inset-0 z-0 opacity-10">
                    <Image
                        src="/images/Gemini_Generated_Image_tunm5xtunm5xtunm.png"
                        alt="Background pattern"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-rose-900/80" />
                </div>
            </section>

            <OurStorySection />
            <OurMissionSection />
            <OurVisionSection />

            {/* Gallery as a footer to the about section */}
            <GallerySection />

            <Footer />
        </div>
    );
}
