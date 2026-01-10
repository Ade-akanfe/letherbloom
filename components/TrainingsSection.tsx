"use client";

import { motion } from "framer-motion";

interface TrainingTypeProps {
  title: string;
  description: string;
  icon: string;
}

function TrainingTypeCard({ title, description, icon }: TrainingTypeProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
    >
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 p-6 shadow-lg text-white">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm opacity-90">{description}</p>
      </div>
    </motion.div>
  );
}

export default function TrainingsSection() {
  const trainings = [
    {
      title: "Personal Training",
      description: "One-on-one sessions tailored to your goals",
      icon: "💪",
    },
    {
      title: "Group Fitness Classes",
      description: "Train with community for extra motivation",
      icon: "👥",
    },
    {
      title: "Functional Training",
      description: "Build real-world strength and mobility",
      icon: "🎯",
    },
  ];

  return (
    <section id="trainings" className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
         
        >
          <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
            Training Options
          </p>
          <h2 className="mt-2 text-4xl font-bold text-zinc-900">
            Trainings
          </h2>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {trainings.map((training, index) => (
            <motion.div
              key={training.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TrainingTypeCard {...training} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
