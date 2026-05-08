import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const CACHE_KEY = 'iss_dashboard_news';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CATEGORIES = ['general', 'science', 'technology', 'health', 'business', 'entertainment', 'sports'];

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('space');
  const [category, setCategory] = useState('science');
  const [cacheAge, setCacheAge] = useState(null);

  // Check if cached data is still valid
  const getCachedData = useCallback((query, cat) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;

      if (age < CACHE_DURATION && parsed.query === query && parsed.category === cat) {
        setCacheAge(Math.round(age / 1000 / 60)); // age in minutes
        return parsed.articles;
      }
    } catch (e) {
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }, []);

  // Save data to cache
  const setCachedData = useCallback((articleData, query, cat) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          articles: articleData,
          query,
          category: cat,
          timestamp: Date.now(),
        })
      );
      setCacheAge(0);
    } catch (e) {
      console.error('Failed to cache news:', e);
    }
  }, []);

  // Fetch news from API
  const fetchNews = useCallback(
    async (bypassCache = false) => {
      // Check cache first
      if (!bypassCache) {
        const cached = getCachedData(searchQuery, category);
        if (cached) {
          setArticles(cached);
          return;
        }
      }

      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_NEWS_API_KEY;

      if (!apiKey || apiKey === 'your_newsapi_key_here' || apiKey === 'placeholder') {
        // Use mock data when no API key
        const mockArticles = generateMockArticles(searchQuery, category);
        setArticles(mockArticles);
        setCachedData(mockArticles, searchQuery, category);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://newsdata.io/api/1/latest', {
          params: {
            apikey: apiKey,
            q: searchQuery || 'space',
            category: category === 'general' ? 'top' : category,
            language: 'en'
          },
        });

        const fetchedArticles = (response.data.results || []).map(article => ({
          title: article.title,
          description: article.description,
          urlToImage: article.image_url,
          source: { name: article.source_name },
          publishedAt: article.pubDate,
          url: article.link
        }));
        setArticles(fetchedArticles);
        setCachedData(fetchedArticles, searchQuery, category);
      } catch (err) {
        console.error('News fetch error:', err);
        // Fallback: try cache first, then mock data
        const cached = getCachedData(searchQuery, category);
        if (cached) {
          setArticles(cached);
        } else {
          const mockArticles = generateMockArticles(searchQuery, category);
          setArticles(mockArticles);
          setCachedData(mockArticles, searchQuery, category);
        }
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, category, getCachedData, setCachedData]
  );

  // Search function
  const search = useCallback(
    (query) => {
      setSearchQuery(query);
    },
    []
  );

  // Refresh (bypass cache)
  const refresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  // Auto-fetch when query or category changes
  useEffect(() => {
    fetchNews();
  }, [searchQuery, category]);

  return {
    articles,
    loading,
    error,
    searchQuery,
    category,
    categories: CATEGORIES,
    cacheAge,
    search,
    setCategory,
    refresh,
  };
}

// Generate mock articles when no API key is available
function generateMockArticles(query, category) {
  const mockData = [
    {
      title: 'ISS Completes 150,000th Orbit Around Earth',
      description: 'The International Space Station has achieved a remarkable milestone, completing its 150,000th orbit around Earth since its launch in 1998.',
      urlToImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
      source: { name: 'Space News' },
      publishedAt: new Date().toISOString(),
      url: '#',
    },
    {
      title: 'NASA Announces New Crew Dragon Mission',
      description: 'SpaceX and NASA have announced the next Crew Dragon mission to the International Space Station, scheduled for next month.',
      urlToImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400',
      source: { name: 'NASA Blog' },
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      url: '#',
    },
    {
      title: 'Breakthrough in Space Agriculture Research',
      description: 'Scientists aboard the ISS have successfully grown a new variety of tomatoes in microgravity, opening possibilities for deep space missions.',
      urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400',
      source: { name: 'Science Daily' },
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      url: '#',
    },
    {
      title: 'Solar Storm Alert: Potential Impact on Satellites',
      description: 'NOAA has issued a warning about increased solar activity that could affect satellite communications and the ISS orbit.',
      urlToImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
      source: { name: 'Weather Channel' },
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      url: '#',
    },
    {
      title: 'European Space Agency Plans Moon Base',
      description: 'ESA reveals ambitious plans for a permanent lunar base that could serve as a stepping stone for Mars exploration.',
      urlToImage: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=400',
      source: { name: 'ESA News' },
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      url: '#',
    },
    {
      title: 'SpaceX Starship Achieves Full Orbit',
      description: 'In a historic achievement, SpaceX\'s Starship completed a full orbital flight, marking a new era in space transportation.',
      urlToImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400',
      source: { name: 'Tech Crunch' },
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      url: '#',
    },
  ];

  return mockData;
}
