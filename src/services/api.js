import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client instance with better error handling
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    // Add error handling for failed requests
    global: {
      fetch: (...args) => {
        return fetch(...args).catch(err => {
          console.error('Supabase request failed:', err);
          throw err;
        });
      }
    }
  }
);

// Utility function for retrying failed operations with exponential backoff
const retryOperation = async (operation, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await operation();
      // For single-row queries that return no results, return null instead of throwing
      if (result.error?.code === 'PGRST116') {
        return { data: null, error: null };
      }
      return result;
    } catch (error) {
      lastError = error;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw lastError;
};

export const api = {
  // Auth methods
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Manga methods with improved error handling
  getMangaById: async (id) => {
    const { data, error } = await retryOperation(async () => 
      await supabase
        .from('manga')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    );
    if (error) throw error;
    return data;
  },

  getMangaChapters: async (mangaId) => {
    const { data, error } = await retryOperation(async () => 
      await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', mangaId)
        .order('chapter_number', { ascending: true })
    );
    if (error) throw error;
    return data || [];
  },

  getChapter: async (mangaId, chapterNumber) => {
    const { data, error } = await retryOperation(async () => 
      await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', mangaId)
        .eq('chapter_number', chapterNumber)
        .maybeSingle()
    );
    if (error) throw error;
    return data;
  },

  // Favorites methods with improved error handling
  getFavoriteStatus: async (userId, mangaId) => {
    try {
      const { data, error } = await retryOperation(async () => 
        await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('manga_id', mangaId)
          .maybeSingle()
      );

      if (error) throw error;

      return {
        isFavorite: !!data,
        favoriteId: data?.id || null
      };
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return {
        isFavorite: false,
        favoriteId: null
      };
    }
  },

  toggleFavorite: async (userId, mangaId, favoriteId) => {
    if (favoriteId) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      if (error) throw error;
      return { isFavorite: false, favoriteId: null };
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, manga_id: mangaId }])
        .select()
        .maybeSingle();
      if (error) throw error;
      return { isFavorite: true, favoriteId: data?.id };
    }
  }
};