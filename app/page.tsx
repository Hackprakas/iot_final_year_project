'use client';

import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import Link from 'next/link';




const LandingPage = () => {
  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center text-white text-center p-6"
      initial={{ background: "linear-gradient(90deg, #3b82f6, #9333ea)" }}
      animate={{
        background: [
          "linear-gradient(90deg, #3b82f6, #9333ea)",
          "linear-gradient(90deg, #ef4444, #f97316)",
          "linear-gradient(90deg, #10b981, #06b6d4)",
          "linear-gradient(90deg, #3b82f6, #9333ea)"
        ]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <h1 className="text-4xl md:text-6xl font-bold">Industrial Equipment Monitoring</h1>
      <h2 className="text-xl md:text-2xl mt-4">
        <TypeAnimation
          sequence={["Real-time Insights", 2000, "Failure Prevention", 2000, "IoT-powered Analytics", 2000]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </h2>
      <p className="mt-6 text-lg md:text-xl max-w-2xl">
        Monitor and prevent failures in industrial equipment with IoT-driven real-time analytics and predictive maintenance.
      </p>
      <Link href="/dashboard">

        <button className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition">
          Get Started
        </button>
      </Link>
    </motion.div>
  );
};

export default LandingPage;
