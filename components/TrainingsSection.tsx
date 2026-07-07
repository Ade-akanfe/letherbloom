"use client";

import { motion } from "framer-motion";

interface TrainingTypeProps {
  title: string;
  description: string;
  icon: string;
  type: "personal" | "group" | "functional";
  isActive: boolean;
  onClick: () => void;
}

function TrainingTypeCard({ title, description, icon, isActive, onClick }: TrainingTypeProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <div className={`overflow-hidden rounded-2xl p-8 transition-all duration-300 shadow-lg text-white h-full border-2 flex flex-col justify-between ${isActive
        ? "bg-gradient-to-br from-rose-500 to-rose-700 border-rose-400 scale-105 z-10"
        : "bg-zinc-800 border-zinc-700 hover:border-zinc-500 opacity-80 hover:opacity-100"
        }`}>
        <div>
          <div className="mb-4 text-4xl">{icon}</div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-3 text-base opacity-90 leading-relaxed">{description}</p>
        </div>
        <div className={`mt-6 inline-flex items-center text-sm font-bold ${isActive ? "text-white" : "text-rose-400"}`}>
          {isActive ? "Selected" : "Select Training"}
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainingsSection({
  selectedType,
  onSelect
}: {
  selectedType: "personal" | "group" | "functional";
  onSelect: (type: "personal" | "group" | "functional") => void;
}) {
  const trainings = [
    {
      title: "Personal Training",
      description: "One-on-one sessions tailored to your goals",
      icon: "💪",
      type: "personal" as const,
    },
    {
      title: "Group Fitness Classes",
      description: "Train with community for extra motivation",
      icon: "👥",
      type: "group" as const,
    },
    {
      title: "Functional Training",
      description: "Build real-world strength and mobility",
      icon: "🎯",
      type: "functional" as const,
    },
  ];

  return (
    <section id="trainings" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Training Options
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900 md:text-5xl">
              Choose Your Journey
            </h2>
            <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
              Select a training style to see available plans and pricing tailored for you.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {trainings.map((training, index) => (
            <motion.div
              key={training.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <TrainingTypeCard
                {...training}
                isActive={selectedType === training.type}
                onClick={() => onSelect(training.type)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
