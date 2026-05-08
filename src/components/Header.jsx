import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Wifi, WifiOff, Clock } from 'lucide-react';

export default function Header({ isDark, toggleDark, isConnected }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b backdrop-blur-xl
        ${isDark ? 'bg-dark-950/70 border-dark-700/30' : 'bg-white/70 border-gray-200/50'}`}
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">ISS Command Center</span>
        </h1>
        <p className={`text-sm mt-0.5 ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
          Real-Time Tracking Dashboard
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          ${isConnected
            ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
          {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isConnected ? 'Live' : 'Offline'}
        </div>

        {/* Clock */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          ${isDark ? 'bg-dark-800/50 text-dark-300' : 'bg-gray-100 text-gray-600'}`}>
          <Clock className="w-3.5 h-3.5" />
          {time.toLocaleTimeString()}
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDark}
          className={`p-2.5 rounded-xl transition-all duration-200
            ${isDark
              ? 'bg-dark-800 text-yellow-400 hover:bg-dark-700 border border-dark-700/50'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          aria-label="Toggle dark mode"
          id="theme-toggle"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </motion.header>
  );
}
