import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowUpDown, MessageCircle, Loader, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../hooks/useFavorite';
import { api } from '../services/api';

function MangaReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  
  const {
    isFavorite,
    loading: favoriteLoading,
    toggleFavorite
  } = useFavorite(user?.id, id);

  useEffect(() => {
    fetchMangaDetails();
  }, [id]);

  const fetchMangaDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch manga details
      const mangaData = await api.getMangaById(id);
      setManga(mangaData);

      // Fetch chapters
      const chaptersData = await api.getMangaChapters(id);
      setChapters(sortAscending ? chaptersData : [...chaptersData].reverse());
    } catch (err) {
      console.error('Error fetching manga details:', err);
      setError('Failed to load manga details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/manga/${id}` } });
      return;
    }

    try {
      await toggleFavorite();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
    setChapters([...chapters].reverse());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
          <span className="text-gray-400">Loading manga details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchMangaDetails}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">Manga not found</h2>
          <Link 
            to="/manga" 
            className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block"
          >
            Browse Manga
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-300">home</Link>
            <span className="text-gray-600">{' > '}</span>
            <Link to="/manga" className="text-gray-500 hover:text-gray-300">manga list</Link>
            <span className="text-gray-600">{' > '}</span>
            <span className="text-gray-300">{manga.title}</span>
          </div>
        </div>
      </div>

      {/* Manga Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Image */}
          <div className="w-full md:w-48 h-64 flex-shrink-0">
            <img
              src={manga.cover_url}
              alt={manga.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Manga Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{manga.title}</h1>
                <p className="text-gray-400 text-sm mb-4">{manga.author}</p>
              </div>
              <button
                onClick={handleFavoriteClick}
                disabled={favoriteLoading}
                className={`
                  bg-[#2a2a2a] p-2 rounded-lg transition-all duration-200
                  ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}
                `}
              >
                {favoriteLoading ? (
                  <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
                ) : (
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  />
                )}
              </button>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{manga.description}</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg tracking-wide">
              CHAPTERS ({chapters.length})
            </h2>
            <button 
              onClick={toggleSort}
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-sm">
                {sortAscending ? 'Newest First' : 'Oldest First'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/manga/${manga.id}/chapter/${chapter.chapter_number}`}
                className="bg-[#1f1f1f] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors group"
              >
                <div className="flex items-center p-4">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img
                      src={chapter.pages?.[0] || manga.cover_url}
                      alt={`Chapter ${chapter.chapter_number}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = manga.cover_url;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">
                        Chapter {String(chapter.chapter_number).padStart(3, '0')}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(chapter.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-gray-400 text-sm mt-1 truncate group-hover:text-white transition-colors">
                      {chapter.title || `Chapter ${chapter.chapter_number}`}
                    </h3>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-white p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement comments feature
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {chapters.length === 0 && (
            <div className="text-center py-12 bg-[#1f1f1f] rounded-lg">
              <p className="text-gray-400">No chapters available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MangaReader;