import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ISSMap from './components/ISSMap';
import ISSStats from './components/ISSStats';
import AstronautList from './components/AstronautList';
import SpeedChart from './components/SpeedChart';
import NewsFeed from './components/NewsFeed';
import CategoryPieChart from './components/CategoryPieChart';
import Chatbot from './components/Chatbot';
import { useISSData } from './hooks/useISSData';
import { useNews } from './hooks/useNews';
import { useDarkMode } from './hooks/useDarkMode';
import { useChatbot } from './hooks/useChatbot';

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const {
    position,
    trajectory,
    speedHistory,
    currentSpeed,
    astronauts,
    loading: issLoading,
    error: issError,
  } = useISSData();

  const {
    articles,
    loading: newsLoading,
    error: newsError,
    searchQuery,
    category,
    categories,
    cacheAge,
    search,
    setCategory,
    refresh,
  } = useNews();

  const { messages, sendMessage, isTyping, clearHistory } = useChatbot({
    position,
    currentSpeed,
    articles,
  });

  const sidebarWidth = sidebarCollapsed ? 72 : 220;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header */}
        <Header isDark={isDark} toggleDark={toggleDark} isConnected={!issError} />

        {/* Dashboard Grid */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map — spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`lg:col-span-2 h-[420px] overflow-hidden
                ${isDark ? 'glass-card' : 'glass-card-light'}`}
            >
              <ISSMap position={position} trajectory={trajectory} isDark={isDark} />
            </motion.div>

            {/* Stats + Astronauts — 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* ISS Stats */}
              <div className={`p-5 ${isDark ? 'glass-card' : 'glass-card-light'}`}>
                <ISSStats position={position} currentSpeed={currentSpeed} isDark={isDark} />
              </div>

              {/* Astronauts */}
              <div className={`p-5 flex-1 overflow-y-auto ${isDark ? 'glass-card' : 'glass-card-light'}`} style={{ maxHeight: 300 }}>
                <AstronautList astronauts={astronauts} isDark={isDark} />
              </div>
            </motion.div>

            {/* Speed Chart — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`lg:col-span-3 p-5 h-[320px] ${isDark ? 'glass-card' : 'glass-card-light'}`}
            >
              <SpeedChart speedHistory={speedHistory} isDark={isDark} />
            </motion.div>

            {/* News Feed — 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`lg:col-span-2 p-5 ${isDark ? 'glass-card' : 'glass-card-light'}`}
              style={{ maxHeight: 500 }}
            >
              <NewsFeed
                articles={articles}
                loading={newsLoading}
                error={newsError}
                searchQuery={searchQuery}
                category={category}
                categories={categories}
                cacheAge={cacheAge}
                search={search}
                setCategory={setCategory}
                refresh={refresh}
                isDark={isDark}
              />
            </motion.div>

            {/* Pie Chart — 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-5 ${isDark ? 'glass-card' : 'glass-card-light'}`}
              style={{ maxHeight: 500 }}
            >
              <CategoryPieChart articles={articles} isDark={isDark} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Floating Chatbot */}
      <Chatbot
        messages={messages}
        sendMessage={sendMessage}
        isTyping={isTyping}
        clearHistory={clearHistory}
        isDark={isDark}
      />
    </div>
  );
}
