"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Trainings", href: "/#trainings" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Contacts", href: "/#contacts" },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          >
            <div
              className="h-full w-full bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
          </motion.div>

          {/* Side Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ position: 'fixed', left: 0, top: 0, zIndex: 50, height: '100vh' }}
          >
            <div
              className="h-dvh w-[85vw] max-w-sm bg-white shadow-2xl md:hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative flex h-full flex-col p-6">
                {/* Close Button */}
                <button
                  className="absolute right-4 top-4 p-2 text-zinc-500 transition hover:text-zinc-900 active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Top: Logo & Name */}
                <div className="mt-8 flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                    <Image
                      src="/hero-arm.svg"
                      alt="LetHerBloom Logo"
                      width={200}
                      height={200}
                      className="h-auto w-auto"
                    />
                  </div>
                  <span className="mt-2 text-xl font-bold text-rose-700">LetHerBloom</span>
                </div>

                {/* Center: Navigation Items */}
                <nav className="flex grow flex-col justify-center space-y-6 text-center">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block text-xl font-semibold text-zinc-900 transition hover:text-rose-600"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </nav>

                {/* Bottom: CTA Button */}
                <div className="mb-8">
                  <Link href="/live-training" onClick={handleLinkClick} className="w-full block text-center rounded-full bg-rose-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-rose-700 active:scale-95">
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6 text-zinc-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Content moved to Portal */}
      {createPortal(menuContent, document.body)}
    </>
  );
}
