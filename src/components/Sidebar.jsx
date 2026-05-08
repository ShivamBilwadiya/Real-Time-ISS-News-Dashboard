import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Newspaper, MessageCircle, BarChart3, Home, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'tracking', icon: Satellite, label: 'ISS Tracking' },
  { id: 'news', icon: Newspaper, label: 'News Feed' },
  { id: 'charts', icon: BarChart3, label: 'Analytics' },
  { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
];

export default function Sidebar({ isDark, collapsed, setCollapsed, activeSection, setActiveSection }) {
  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0, width: collapsed ? 72 : 220 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 h-screen z-30 flex flex-col py-6 
        ${isDark ? 'glass-sidebar' : 'glass-sidebar-light'}
        transition-colors duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Satellite className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg gradient-text whitespace-nowrap"
          >
            ISS CMD
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? isDark
                    ? 'bg-primary-500/20 text-primary-400 shadow-lg shadow-primary-500/10'
                    : 'bg-primary-50 text-primary-600'
                  : isDark
                    ? 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'drop-shadow-glow' : ''}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
            ${isDark ? 'text-dark-400 hover:text-white hover:bg-dark-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
