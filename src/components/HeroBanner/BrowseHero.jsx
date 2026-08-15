import { useState, useEffect } from 'react';
import tmdb, { requests } from '../../services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroBanner.css';

export default function BrowseHero({ 
  fetchUrl = requests.fetchTrending, 
  onPlayClick, 
  onMoreInfoClick 
}) {
  const [allMovies, setAllMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const request = await tmdb.get(fetchUrl);
        const results = (request.data.results || []).filter(
          (m) => m.backdrop_path && (m.overview || m.title || m.name)
        );
        if (results.length > 0) {
          setAllMovies(results);
          setMovie(results[0]);
          setMovieIndex(0);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch TMDB data", err);
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl]);

  useEffect(() => {
    if (allMovies.length <= 1) return;

    const intervalId = setInterval(() => {
      setMovieIndex((prev) => {
        const nextIndex = (prev + 1) % allMovies.length;
        setMovie(allMovies[nextIndex]);
        return nextIndex;
      });
    }, 8000);
    return () => clearInterval(intervalId);
  }, [allMovies]);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (loading) {
    return (
      <div className="hero hero--browse skeleton-shimmer">
        <div className="hero__content hero__content--left">
          <div style={{width: '40%', height: '24px', marginBottom: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}></div>
          <div style={{width: '60%', height: '36px', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}></div>
          <div style={{width: '90%', height: '50px', marginBottom: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}></div>
          <div className="hero__buttons">
            <div style={{width: '100px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}></div>
            <div style={{width: '120px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}` 
    : '';

  const title = movie?.title || movie?.name || movie?.original_name || '';
  const isSeries = movie?.media_type === 'tv' || !!movie?.first_air_date;

  return (
    <div className="hero hero--browse">
      <AnimatePresence>
        {backdropUrl ? (
          <motion.div 
            key={backdropUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="hero__background"
            style={{ backgroundImage: `url('${backdropUrl}')` }}
          />
        ) : (
          <div className="hero__background hero__background-fallback" />
        )}
      </AnimatePresence>
      
      <div className="hero__overlay" />

      <div className="hero__content hero__content--left">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie?.id || 'hero-movie'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <div className="hero__badge">
              <span className="hero__badge-n">N</span> {isSeries ? 'SERIES' : 'FILM'}
            </div>
            <h1 className="hero__title--text">
              {title}
            </h1>
            
            <div className="hero__meta">
              <span className="hero__match">{Math.floor(Math.random() * 15 + 85)}% Match</span>
              <span className="hero__rating">{movie?.adult ? '18+' : 'U/A 16+'}</span>
              <span>{movie?.release_date ? movie.release_date.substring(0, 4) : (movie?.first_air_date ? movie.first_air_date.substring(0, 4) : '2024')}</span>
            </div>

            <p className="hero__description">
              {truncate(movie?.overview, 140)}
            </p>

            <div className="hero__buttons">
              <button 
                className="btn-netflix-play" 
                onClick={() => onPlayClick && movie && onPlayClick(movie)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
              <button 
                className="btn-netflix-info" 
                onClick={() => onMoreInfoClick && movie && onMoreInfoClick(movie)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
