"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contacts" className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Get in Touch
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900">
              Have Questions? We're Here to Help
            </h2>
            <p className="mt-4 text-zinc-600">
              Reach out to our team and we'll get back to you as soon as
              possible
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-zinc-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-zinc-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-zinc-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-zinc-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                  placeholder="Tell us more..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="w-full rounded-lg bg-rose-600 px-8 py-4 font-semibold text-white transition shadow-lg hover:bg-rose-700">
                  Send Message
                </button>
              </motion.button>
            </form>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl mb-2">📧</div>
                <p className="text-sm text-zinc-600">Email</p>
                <p className="font-semibold text-zinc-900">
                  hello@letherbloom.com
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-sm text-zinc-600">Phone</p>
                <p className="font-semibold text-zinc-900">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📍</div>
                <p className="text-sm text-zinc-600">Location</p>
                <p className="font-semibold text-zinc-900">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
