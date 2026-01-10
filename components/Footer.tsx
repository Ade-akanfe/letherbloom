"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Trainings", href: "#trainings" },
    { name: "Pricing", href: "#plans" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contacts" },
  ];

  const socialMedia = [
    { name: "Instagram", icon: "📷", url: "https://instagram.com" },
    { name: "Facebook", icon: "f", url: "https://facebook.com" },
    { name: "Twitter", icon: "𝕏", url: "https://twitter.com" },
    { name: "LinkedIn", icon: "in", url: "https://linkedin.com" },
    { name: "YouTube", icon: "▶", url: "https://youtube.com" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="bg-zinc-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 xl:px-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg ">
                  <Image
                    src="/hero-arm.svg"
                    alt="letHerBloom Logo"
                    width={40}
                    height={40}
                    className="h-8 w-8"
                  />
                </div>
                <span className="text-2xl font-bold text-rose-500">letHerBloom</span>
              </Link>
              <p className="mt-4 text-zinc-400">
                Empowering women through strength, mobility, and confidence-building workouts.
              </p>
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-zinc-300">Follow Us</p>
                <div className="flex gap-3">
                  {socialMedia.map((social) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-sm font-bold transition hover:bg-rose-500"
                      title={social.name}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 transition hover:text-rose-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                Programs
              </h3>
              <ul className="space-y-2">
                {[
                  "Personal Training",
                  "Group Classes",
                  "Functional Training",
                  "Custom Plans",
                  "Nutrition Guide",
                ].map((program) => (
                  <li key={program}>
                    <Link href="#" className="text-zinc-400 transition hover:text-rose-500">
                      {program}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <p className="text-sm text-zinc-400">Email</p>
                  <Link
                    href="mailto:hello@letherbloom.com"
                    className="text-white transition hover:text-rose-500"
                  >
                    hello@letherbloom.com
                  </Link>
                </li>
                <li>
                  <p className="text-sm text-zinc-400">Phone</p>
                  <Link
                    href="tel:+15551234567"
                    className="text-white transition hover:text-rose-500"
                  >
                    +1 (555) 123-4567
                  </Link>
                </li>
                <li>
                  <p className="text-sm text-zinc-400">Location</p>
                  <p className="text-white">San Francisco, CA</p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-zinc-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-zinc-400">
            © {currentYear} letHerBloom. All rights reserved.
          </p>

          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-zinc-400 transition hover:text-rose-500"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            href="#"
            className="text-sm text-zinc-400 transition hover:text-rose-500 hover:-translate-y-0.5"
          >
            Back to Top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
