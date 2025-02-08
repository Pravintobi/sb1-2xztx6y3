import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronUp, ChevronDown, Loader, AlertCircle, Heart } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../hooks/useFavorite';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function ChapterReader() {
  const { id, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chapter, setChapter] = useState(null);
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const {
    isFavorite,
    loading: favoriteLoading,
    toggleFavorite
  } = useFavorite(user?.id, id);

  useEffect(() => {
    fetchChapterDetails();
  }, [id, chapterNumber]);

  const fetchChapterDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch manga details
      const mangaData = await api.getMangaById(id);
      setManga(mangaData);

      // Fetch chapter details
      const chapterData = await api.getChapter(id, parseInt(chapterNumber));
      setChapter(chapterData);
    } catch (err) {
      console.error('Error fetching chapter details:', err);
      setError('Failed to load chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/manga/${id}/chapter/${chapterNumber}` } });
      return;
    }

    try {
      await toggleFavorite();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
          <span className="text-gray-400">Loading chapter...</span>
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
            onClick={fetchChapterDetails}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!manga || !chapter) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">Chapter not found</h2>
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

  const pdfUrl = chapter.storage_url || chapter.pdf_url;

  if (!pdfUrl) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">
            Chapter content not available
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#1a1a1a]/80 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/manga/${id}`}
                className="text-gray-400 hover:text-white flex items-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to chapters</span>
              </Link>
              <h1 className="text-white font-bold">
                {manga.title} - Chapter {chapterNumber}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavoriteClick}
                disabled={favoriteLoading}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2a2a2a]'}
                `}
              >
                {favoriteLoading ? (
                  <Loader className="w-5 h-5 text-yellow-500 animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  />
                )}
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {numPages || '?'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex justify-center items-center h-[800px]">
                <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
              </div>
            }
            error={
              <div className="flex justify-center items-center h-[800px] text-red-500">
                <p>Failed to load PDF. Please try again.</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-4 pdf-page"
                width={800}
                onRenderSuccess={() => {
                  if (index === 0) setCurrentPage(1);
                }}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}

export default ChapterReader;