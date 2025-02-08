import React, { useState, useEffect } from 'react';

function LoadingScreen() {
  const [split, setSplit] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [gifFadeOut, setGifFadeOut] = useState(false);

  useEffect(() => {
    // Show GIF after initial render
    const gifTimer = setTimeout(() => {
      setShowGif(true);
    }, 100);

    // Start split animation after 1 second
    const splitTimer = setTimeout(() => {
      setSplit(true);
    }, 1000);

    // Fade out GIF after 2.5 seconds
    const gifFadeTimer = setTimeout(() => {
      setGifFadeOut(true);
    }, 2500);

    // Start fade out after 3 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    return () => {
      clearTimeout(gifTimer);
      clearTimeout(splitTimer);
      clearTimeout(gifFadeTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Naruto Running GIF */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          showGif ? 'opacity-100' : 'opacity-0'
        } ${gifFadeOut ? 'opacity-0' : ''}`}
      >
        <div 
          className="transform transition-all duration-1000"
          style={{ height: '7rem' }}
        >
          <img
            src="https://media4.giphy.com/media/cpkQpkVFOOoNi/giphy.gif?cid=6c09b952oniu0p52s5rh8an18jgivmaddrpaml4799t2wqh9&ep=v1_gifs_search&rid=giphy.gif&ct=g"
            alt="Naruto Running"
            className={`h-full w-auto object-contain opacity-60 transition-transform duration-1000 ${
              split ? 'scale-150' : 'scale-100'
            }`}
          />
        </div>
      </div>

      {/* Loading Text Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="flex items-center overflow-visible">
          {/* TOBI Text */}
          <div
            className={`transform transition-all duration-1000 ease-in-out ${
              split ? '-translate-x-20 scale-110 blur-sm' : ''
            }`}
          >
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 filter drop-shadow-lg">
              TOBI
            </span>
          </div>

          {/* MANGA Text */}
          <div
            className={`transform transition-all duration-1000 ease-in-out ${
              split ? 'translate-x-20 scale-110 blur-sm' : ''
            }`}
          >
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 filter drop-shadow-lg">
              MANGA
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`mt-4 transition-all duration-1000 ${
            split ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-gray-400 text-lg font-medium tracking-wider">
            Your Gateway to Manga Excellence
          </span>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-loading-progress"></div>
        </div>
        <div 
          className={`text-center mt-4 text-gray-400 text-sm transition-opacity duration-500 ${
            split ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Loading your manga experience...
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;