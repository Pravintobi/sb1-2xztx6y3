import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with better configuration
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Initial banner data with valid image URLs
const initialBanners = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&q=80&w=1600',
    title: 'Featured Manga 1',
    link: '/manga/1',
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1600',
    title: 'Featured Manga 2',
    link: '/manga/2',
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=1600',
    title: 'Featured Manga 3',
    link: '/manga/3',
  },
];

function HeroBanner() {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState(initialBanners);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const fetchBannerImages = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_images')
        .select('*')
        .order('order')
        .eq('active', true);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const validBanners = data.filter(banner => 
          banner.image_url && banner.image_url.startsWith('http')
        );
        
        if (validBanners.length > 0) {
          setBannerImages(validBanners);
        }
      }
    } catch (error) {
      console.error('Error fetching banner images:', error);
      setError(error.message);
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container || isTransitioning) return;
    
    setIsTransitioning(true);
    const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
    
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    setCurrentIndex(prev => {
      const newIndex = direction === 'left' 
        ? (prev - 1 + bannerImages.length) % bannerImages.length
        : (prev + 1) % bannerImages.length;
      return newIndex;
    });

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused) return;

    const interval = setInterval(() => {
      if (isTransitioning) return;

      const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth;
      
      setIsTransitioning(true);
      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentIndex(0);
      } else {
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
        setCurrentIndex(prev => (prev + 1) % bannerImages.length);
      }
      
      setTimeout(() => setIsTransitioning(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, bannerImages.length, isTransitioning]);

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 py-4 px-4"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {bannerImages.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link || '#'}
            className={`
              flex-none w-full md:w-[800px] h-[200px] md:h-[350px] rounded-lg overflow-hidden scroll-snap-align-start
              transform transition-all duration-500 ease-in-out
              ${index === currentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}
              hover:scale-[1.02] hover:shadow-2xl
            `}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={banner.image_url}
                alt={banner.title || ''}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&q=80&w=1600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {banner.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-lg md:text-2xl font-bold shadow-lg">
                    {banner.title}
                  </h3>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Buttons - Hidden on Mobile */}
      {!isMobile && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
              bg-black/30 text-white backdrop-blur-sm z-10
              transition-all duration-300 transform
              ${showLeftButton ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
              hover:bg-black/50 hover:scale-110
            `}
            disabled={!showLeftButton || isTransitioning}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
              bg-black/30 text-white backdrop-blur-sm z-10
              transition-all duration-300 transform
              ${showRightButton ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
              hover:bg-black/50 hover:scale-110
            `}
            disabled={!showRightButton || isTransitioning}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              const container = scrollRef.current;
              if (!container) return;
              
              setIsTransitioning(true);
              container.scrollTo({ 
                left: index * (isMobile ? container.offsetWidth : 800),
                behavior: 'smooth'
              });
              setCurrentIndex(index);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className={`
              w-2 h-2 rounded-full transition-all duration-300 transform
              ${index === currentIndex 
                ? 'bg-white scale-110 w-4' 
                : 'bg-white/50 hover:bg-white/70'}
              hover:scale-105
            `}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;