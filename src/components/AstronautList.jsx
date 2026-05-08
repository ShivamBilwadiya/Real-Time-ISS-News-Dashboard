import React from 'react';
import { motion } from 'framer-motion';
import { User, Rocket } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AstronautList({ astronauts, isDark }) {
  const issAstronauts = astronauts.filter((a) => a.craft === 'ISS');
  const otherAstronauts = astronauts.filter((a) => a.craft !== 'ISS');

  return (
    <div>
      {/* ISS Crew Header */}
      <div className="flex items-center gap-2 mb-4">
        <Rocket className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Crew in Space
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold
          ${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
          {astronauts.length}
        </span>
      </div>

      {/* ISS Crew */}
      {issAstronauts.length > 0 && (
        <div className="mb-3">
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
            🛰️ ISS ({issAstronauts.length})
          </p>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-1.5">
            {issAstronauts.map((astro, index) => (
              <motion.div
                key={astro.name}
                variants={item}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isDark ? 'hover:bg-dark-700/50' : 'hover:bg-gray-100'}`}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 
                  flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {astro.name.charAt(0)}
                </div>
                <span className={`text-sm font-medium truncate ${isDark ? 'text-dark-200' : 'text-gray-700'}`}>
                  {astro.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Other craft crews */}
      {otherAstronauts.length > 0 && (
        <div>
          {[...new Set(otherAstronauts.map((a) => a.craft))].map((craft) => (
            <div key={craft} className="mb-3">
              <p className={`text-xs font-medium mb-2 ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
                🚀 {craft} ({otherAstronauts.filter((a) => a.craft === craft).length})
              </p>
              <div className="space-y-1.5">
                {otherAstronauts
                  .filter((a) => a.craft === craft)
                  .map((astro) => (
                    <div
                      key={astro.name}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg
                        ${isDark ? 'hover:bg-dark-700/50' : 'hover:bg-gray-100'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {astro.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium truncate ${isDark ? 'text-dark-200' : 'text-gray-700'}`}>
                        {astro.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {astronauts.length === 0 && (
        <div className={`text-center py-8 text-sm ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
          Loading crew data...
        </div>
      )}
    </div>
  );
}
