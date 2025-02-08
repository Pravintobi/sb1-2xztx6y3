import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useFavorite(userId, mangaId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkFavoriteStatus = async () => {
      if (!userId || !mangaId) {
        setIsFavorite(false);
        setFavoriteId(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const { isFavorite: status, favoriteId: id } = await api.getFavoriteStatus(userId, mangaId);
        
        if (mounted) {
          setIsFavorite(status);
          setFavoriteId(id);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFavoriteStatus();

    return () => {
      mounted = false;
    };
  }, [userId, mangaId]);

  const toggleFavorite = async () => {
    if (!userId || !mangaId) {
      throw new Error('User ID and Manga ID are required');
    }

    try {
      setLoading(true);
      setError(null);
      const { isFavorite: newStatus, favoriteId: newId } = await api.toggleFavorite(
        userId,
        mangaId,
        favoriteId
      );
      setIsFavorite(newStatus);
      setFavoriteId(newId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    favoriteId,
    loading,
    error,
    toggleFavorite
  };
}