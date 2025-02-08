import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MangaList from './pages/MangaList';
import MangaReader from './pages/MangaReader';
import ChapterReader from './pages/ChapterReader';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {loading && <LoadingScreen />}
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-black">
          <Navbar />
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/manga" element={<MangaList />} />
              <Route path="/manga/:id" element={<MangaReader />} />
              <Route path="/manga/:id/chapter/:chapterNumber" element={<ChapterReader />} />
              <Route path="/login" element={<Login />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;