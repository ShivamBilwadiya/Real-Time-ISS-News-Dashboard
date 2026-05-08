import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, ExternalLink, Clock, Filter, X } from 'lucide-react';

export default function NewsFeed({ articles, loading, error, searchQuery, category, categories, cacheAge, search, setCategory, refresh, isDark }) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    search(inputValue);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-dark-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search news..."
            id="news-search"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 outline-none
              ${isDark
                ? 'bg-dark-800/60 border border-dark-700/50 text-white placeholder:text-dark-500 focus:border-primary-500/50'
                : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary-400'
              }`}
          />
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-xl transition-all duration-200
            ${isDark ? 'bg-dark-800/60 border border-dark-700/50 text-dark-300 hover:text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'}`}
          id="news-filter-toggle"
        >
          <Filter className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={refresh}
          className={`p-2.5 rounded-xl transition-all duration-200
            ${isDark ? 'bg-dark-800/60 border border-dark-700/50 text-dark-300 hover:text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'}`}
          title="Bypass cache and refresh"
          id="news-refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200
                    ${category === cat
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isDark
                        ? 'bg-dark-700/50 text-dark-300 hover:bg-dark-600/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cache indicator */}
      {cacheAge !== null && (
        <div className={`flex items-center gap-1.5 mb-3 text-xs ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
          <Clock className="w-3 h-3" />
          {cacheAge < 1 ? 'Just refreshed' : `Cached ${cacheAge} min ago`} • Refreshes in {15 - (cacheAge || 0)} min
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Articles */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`rounded-xl p-4 ${isDark ? 'bg-dark-800/40' : 'bg-gray-100'} animate-pulse`}>
              <div className={`h-4 w-3/4 rounded mb-2 ${isDark ? 'bg-dark-700' : 'bg-gray-200'}`} />
              <div className={`h-3 w-full rounded mb-1 ${isDark ? 'bg-dark-700' : 'bg-gray-200'}`} />
              <div className={`h-3 w-2/3 rounded ${isDark ? 'bg-dark-700' : 'bg-gray-200'}`} />
            </div>
          ))
        ) : (
          <AnimatePresence>
            {articles.map((article, index) => (
              <motion.a
                key={article.title + index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`block rounded-xl overflow-hidden border transition-all duration-200
                  ${isDark
                    ? 'bg-dark-800/40 border-dark-700/30 hover:border-primary-500/30'
                    : 'bg-white border-gray-200/50 hover:border-primary-300 shadow-sm'
                  }`}
              >
                <div className="flex gap-3 p-3">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold line-clamp-2 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {article.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 mb-2 ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
                        {article.source?.name}
                      </span>
                      <ExternalLink className={`w-3 h-3 ${isDark ? 'text-dark-600' : 'text-gray-300'}`} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        )}

        {!loading && articles.length === 0 && (
          <div className={`text-center py-8 text-sm ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
            No articles found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
