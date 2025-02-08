import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Eye, 
  ChevronRight, 
  Flame, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Star,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
    db: { schema: 'public' }
  }
);

function Home() {
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [hottest, setHottest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileHottest, setShowMobileHottest] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [updatesData, hottestData] = await Promise.all([
        supabase
          .from('daily_updates')
          .select(`
            id,
            chapter_number,
            is_new,
            update_date,
            manga:manga_id (
              id,
              title,
              views,
              cover_url,
              author
            )
          `)
          .order('update_date', { ascending: false })
          .limit(20),

        supabase
          .from('manga')
          .select('*')
          .order('views', { ascending: false })
          .limit(10)
      ]);

      if (updatesData.error) throw updatesData.error;
      if (hottestData.error) throw hottestData.error;

      setDailyUpdates(updatesData.data || []);
      setHottest(hottestData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load content</p>
          <button 
            onClick={fetchData}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-black">
        <HeroBanner />
        
        <div className="px-4 py-6">
          {/* Latest Updates Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                Latest Updates
              </h2>
              <Link to="/updates" className="text-yellow-500 text-sm flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {dailyUpdates.slice(0, 6).map((update) => (
                <Link key={update.id} to={`/manga/${update.manga.id}`} className="group">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={update.manga.cover_url}
                      alt={update.manga.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                      }}
                    />
                    {update.is_new && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                        UP
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <h3 className="text-white text-xs font-medium truncate">
                        {update.manga.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-300 text-[10px]">#{update.chapter_number}</span>
                        <div className="flex items-center text-gray-300 text-[10px]">
                          <Eye className="w-3 h-3 mr-0.5" />
                          {(update.manga.views / 1000).toFixed(1)}k
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Hottest Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowMobileHottest(!showMobileHottest)}
              className="w-full bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Flame className="w-5 h-5 text-red-500 mr-2" />
                <h2 className="text-lg font-bold text-white">Popular</h2>
              </div>
              {showMobileHottest ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showMobileHottest && (
              <div className="mt-4 space-y-3">
                {hottest.map((manga, index) => (
                  <Link
                    key={manga.id}
                    to={`/manga/${manga.id}`}
                    className="flex items-center bg-[#1a1a1a] rounded-lg p-3"
                  >
                    <span className={`text-lg font-bold w-6 ${
                      index < 3 ? 'text-yellow-500' : 'text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <img
                      src={manga.cover_url}
                      alt={manga.title}
                      className="w-14 h-20 object-cover rounded ml-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/56x80?text=No+Image';
                      }}
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">
                        {manga.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate mt-1">
                        {manga.author}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="flex items-center text-gray-400 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {(manga.views / 1000).toFixed(1)}k
                        </div>
                        <div className="flex items-center text-yellow-500 text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          4.8
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                Categories
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Horror'].map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="bg-[#1a1a1a] rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-white text-sm font-medium">{category}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Trending
              </h2>
              <Link to="/trending" className="text-green-500 text-sm flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {hottest.slice(0, 3).map((manga) => (
                <Link
                  key={manga.id}
                  to={`/manga/${manga.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img
                      src={manga.cover_url}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {Math.floor(Math.random() * 50) + 10}%
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <h3 className="text-white text-xs font-medium truncate">
                        {manga.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="min-h-screen bg-black">
      <HeroBanner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Daily Updates Section */}
          <div className="flex-1">
            <div className="bg-[#1f1f1f] rounded-lg overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a]">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                  <h2 className="text-white font-bold">Daily Updates</h2>
                </div>
                <Link to="/updates" className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold flex items-center">
                  All Updates <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                {dailyUpdates.map((update) => (
                  <Link key={update.id} to={`/manga/${update.manga.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={update.manga.cover_url}
                        alt={update.manga.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {update.is_new && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <h3 className="text-white text-sm font-semibold truncate">{update.manga.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-gray-300 text-xs">Chapter {update.chapter_number}</span>
                          <div className="flex items-center text-gray-300 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            {update.manga.views?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hottest Sidebar */}
          <div className="lg:w-72">
            <div className="bg-[#2a1111] rounded-lg overflow-hidden sticky top-4">
              <div className="flex items-center justify-between px-4 py-3 bg-[#3a1111]">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-red-500 mr-2" />
                  <h2 className="text-white font-bold">Hottest</h2>
                </div>
                <Link to="/hot" className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold">
                  View All
                </Link>
              </div>
              
              <div className="divide-y divide-gray-800">
                {hottest.map((manga, index) => (
                  <Link
                    key={manga.id}
                    to={`/manga/${manga.id}`}
                    className="flex items-center space-x-3 p-3 hover:bg-black/20 transition-colors group"
                  >
                    <span className="text-gray-500 font-bold w-6">{index + 1}</span>
                    <img
                      src={manga.cover_url}
                      alt={manga.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-semibold truncate group-hover:text-yellow-500 transition-colors">
                        {manga.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">{manga.author}</p>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <Eye className="w-3 h-3 mr-1" />
                        {manga.views?.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;