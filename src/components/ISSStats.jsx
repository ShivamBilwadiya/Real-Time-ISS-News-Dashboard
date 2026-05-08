import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Gauge, Timer, ArrowUpCircle, Orbit } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ISSStats({ position, currentSpeed, isDark }) {
  const stats = [
    {
      label: 'Latitude',
      value: position?.latitude?.toFixed(4) || '—',
      suffix: '°',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Longitude',
      value: position?.longitude?.toFixed(4) || '—',
      suffix: '°',
      icon: MapPin,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Speed',
      value: currentSpeed?.toLocaleString() || '—',
      suffix: ' km/h',
      icon: Gauge,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Altitude',
      value: '~408',
      suffix: ' km',
      icon: ArrowUpCircle,
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: 'Orbital Period',
      value: '~92',
      suffix: ' min',
      icon: Timer,
      color: 'from-rose-500 to-red-500',
    },
    {
      label: 'Orbits/Day',
      value: '~15.5',
      suffix: '',
      icon: Orbit,
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`p-4 rounded-xl border transition-all duration-200
              ${isDark
                ? 'bg-dark-800/40 border-dark-700/30 hover:border-primary-500/30'
                : 'bg-white/60 border-gray-200/50 hover:border-primary-300'
              }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
                {stat.label}
              </span>
            </div>
            <p className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
              <span className={`text-xs font-normal ml-0.5 ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
                {stat.suffix}
              </span>
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
