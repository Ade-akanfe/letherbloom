"use client";

import { motion } from "framer-motion";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

function TestimonialCard({ name, role, content, avatar }: TestimonialProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col rounded-2xl bg-white p-8 shadow-lg h-full">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-2xl font-bold text-white">
            {avatar}
          </div>
          <div>
            <h4 className="font-bold text-zinc-900">{name}</h4>
            <p className="text-sm text-zinc-600">{role}</p>
          </div>
        </div>
        <p className="flex-grow text-zinc-700">{content}</p>
        <div className="mt-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-rose-500">
              ★
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content:
        "letHerBloom completely transformed how I approach strength training. The form guides and supportive community made all the difference in my fitness journey.",
      avatar: "👩‍🦰",
    },
    {
      name: "Maria Garcia",
      role: "Busy Professional",
      content:
        "I love how flexible the program is. I can train whenever it fits my schedule, and the coaches are incredibly supportive. I've never felt stronger!",
      avatar: "👩‍💼",
    },
    {
      name: "Jessica Lee",
      role: "Coach Trainee",
      content:
        "The transition from being intimidated by the gym to feeling confident and strong happened faster than I expected. This community is amazing!",
      avatar: "👩",
    },
    {
      name: "Amanda Rodriguez",
      role: "Marathon Runner",
      content:
        "Upper body strength training has completely improved my running performance. The personalized guidance from the coaches is invaluable.",
      avatar: "🏃‍♀️",
    },
  ];

  return (
    <section id="testimonials" className="bg-linear-to-b from-rose-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Success Stories
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900">
              Hear From Our Community
            </h2>
            <p className="mt-4 text-zinc-600">
              Real women, real results, real transformations
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
