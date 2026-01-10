"use client";

import Footer from "@/components/Footer";
import LiveTrainingPage from "@/components/LiveTraining/view";
import Navigation from "@/components/Navigation";

const LiveContentPage = () => {
  return (
    <div className="bg-white">
      <Navigation />
      <LiveTrainingPage />
      <Footer />
    </div>
  );
};

export default LiveContentPage;
