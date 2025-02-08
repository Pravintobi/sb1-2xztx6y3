import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Search, Star } from 'lucide-react';

function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setMangas(data || []);
    } catch (error) {
      console.error('Error fetching manga:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMangas = mangas.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Manga Library</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search manga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMangas.map((manga) => (
          <Link
            key={manga.id}
            to={`/manga/${manga.id}`}
            className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300"
          >
            <img
              src={manga.cover_url}
              alt={manga.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{manga.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{manga.author}</span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  4.5
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MangaList;