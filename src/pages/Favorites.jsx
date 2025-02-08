import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2, Eye, Loader } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/favorites' } });
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          manga:manga_id (
            id,
            title,
            author,
            cover_url,
            views,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId, mangaTitle) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      // Show toast or notification
      console.log(`Removed ${mangaTitle} from favorites`);
    } catch (err) {
      console.error('Error removing favorite:', err);
      // Show error toast
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
          <span className="text-gray-400">Loading favorites...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchFavorites}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
        <p className="text-gray-400 mb-6">
          Start adding manga to your favorites collection
        </p>
        <Link
          to="/manga"
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Browse Manga
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Favorites</h1>
          <p className="text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'manga' : 'manga series'} in your collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(({ id, manga }) => (
          <div
            key={id}
            className="bg-[#1f1f1f] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors group"
          >
            <div className="flex space-x-4 p-4">
              <Link to={`/manga/${manga.id}`} className="flex-shrink-0">
                <img
                  src={manga.cover_url}
                  alt={manga.title}
                  className="w-24 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/96x128?text=No+Image';
                  }}
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/manga/${manga.id}`}>
                  <h3 className="text-lg font-semibold text-white hover:text-yellow-500 transition-colors truncate">
                    {manga.title}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-2">{manga.author}</p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {manga.description}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {manga.views?.toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeFavorite(id, manga.title)}
                    className="flex items-center text-gray-400 hover:text-red-500 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;