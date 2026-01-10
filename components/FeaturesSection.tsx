"use client";

import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Focused Programs",
    description:
      "Short, effective routines to build upper-body strength and muscle endurance tailored for women at every level.",
  },
  {
    title: "Technique & Mobility",
    description:
      "Form-first approach plus mobility drills to keep your shoulders healthy and pain-free.",
  },
  {
    title: "Community",
    description:
      "Connect with coaches and fellow lifters for motivation and accountability.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="mt-10 grid gap-8 md:grid-cols-3">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          delay={index}
        />
      ))}
    </section>
  );
}
