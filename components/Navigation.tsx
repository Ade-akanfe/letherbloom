"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

export default function Navigation() {
  const navItems = ["About", "Trainings", "Testimonials", "Contacts"];

  return (
    <nav className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg">
              <Image
                src="/hero-arm.svg"
                alt="letHerBloom Logo"
                width={200}
                height={200}
                className="h-25 w-20"
              />
            </div>
            <span className="text-xl font-bold text-rose-700">letHerBloom</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group"
              >
                <span className="text-sm font-medium text-zinc-700 transition hover:text-rose-600 block group-hover:scale-105">
                  {item}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/live-training"
              className="rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 active:scale-95"
            >
              Join Today
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
