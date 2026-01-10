
import PricingPageView from "@/components/Pricing/view";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";


export default function PricingPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow container mx-auto px-6 my-10">
                <PricingPageView />
            </main>

            <Footer />
        </div>
    );
}
