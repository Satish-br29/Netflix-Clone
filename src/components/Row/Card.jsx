import React, { useState, useRef, useEffect, useCallback } from 'react';
import tmdb from '../../services/tmdb';
import { useMyList } from '../../context/MyListContext';
import './Row.css';

const baseImageUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function Card({ movie, isLargeRow, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres] = useState([]);
  const { toggleList, isInList } = useMyList();
  
  const inList = movie?.id ? isInList(movie.id) : false;
  
  const hoverTimeoutRef = useRef(null);
  const playTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const imagePath = isLargeRow ? movie.poster_path : (movie.backdrop_path || movie.poster_path);
  
  // Mapping of some common TMDB genre IDs to strings for the UI
  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10765: 'Sci-Fi & Fantasy'
  };

  useEffect(() => {
    if (movie.genre_ids) {
      setGenres(movie.genre_ids.map(id => genreMap[id]).filter(Boolean).slice(0, 3));
    }
  }, [movie]);

  const fetchTrailer = useCallback(async () => {
    if (trailerKey) return; // Already fetched
    
    try {
      // Try movie endpoint first, fallback to tv
      const type = movie.media_type === 'tv' ? 'tv' : 'movie';
      let response = await tmdb.get(`/${type}/${movie.id}/videos`);
      
      if (response.data.results.length === 0 && !movie.media_type) {
        // Fallback if we guessed wrong
        const otherType = type === 'movie' ? 'tv' : 'movie';
        response = await tmdb.get(`/${otherType}/${movie.id}/videos`);
      }

      const trailers = response.data.results.filter(
        vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
      );
      
      if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
      }
    } catch (error) {
      console.error("Failed to fetch trailer for", movie.id, error);
    }
  }, [movie, trailerKey]);

  const handleMouseEnter = () => {
    // 0ms -> Hover begins. Start 300ms expand timer.
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
      fetchTrailer();
      
      // 300ms -> Expanded. Start 900ms trailer timer (1200ms total).
      playTimeoutRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 900);
    }, 300);
  };

  const handleMouseLeave = () => {
    // Clear all timeouts immediately
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    
    // Reset all state
    setIsExpanded(false);
    setIsPlaying(false);
  };

  if (!imagePath) return null;

  const movieTitle = movie.title || movie.name || movie.original_name || movie.original_title || '';

  // Portrait cards (Netflix Originals)
  if (isLargeRow) {
    return (
      <div 
        className="card card--portrait-wrapper" 
        onClick={onClick}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'} 
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img
          className="card__poster card__poster--portrait"
          src={`${baseImageUrl}/w500${imagePath}`}
          alt={movieTitle}
          loading="lazy"
        />
        <div className="card__title-overlay card__title-overlay--portrait">
          <span className="card__badge-n">N</span>
          <span className="card__title-text">{movieTitle}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Base Poster with subtle title caption */}
      <div className="card__base-wrapper">
        <img
          className="card__poster"
          src={`${baseImageUrl}/w500${imagePath}`}
          alt={movieTitle}
          loading="lazy"
        />
        <div className="card__title-overlay">
          <span className="card__title-text">{movieTitle}</span>
        </div>
      </div>

      {/* Hover Expansion Container */}
      <div className={`card__hover-container ${isExpanded ? 'card__hover-container--expanded' : ''}`}>
        
        <div className="card__media-wrapper">
          <img
            className="card__poster"
            src={`${baseImageUrl}/w500${imagePath}`}
            alt={movieTitle}
          />
          
          {trailerKey && isPlaying && (
            <iframe 
              className={`card__video card__video--playing`}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}&showinfo=0&rel=0`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}

          <div className="card__media-title-overlay">
            <span className="card__title-text card__title-text--large">{movieTitle}</span>
          </div>
        </div>

        <div className="card__info">
          <div className="card__controls">
            <div className="card__controls-left">
              <button 
                className="card__btn card__btn--play"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick && onClick();
                }}
                title="Play"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button 
                className={`card__btn ${inList ? 'card__btn--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleList(movie);
                }}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
              <button 
                className="card__btn"
                onClick={(e) => e.stopPropagation()}
                title="Like"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              </button>
            </div>
            <button 
              className="card__btn"
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
              }}
              title="More Info"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          <h4 className="card__info-title">{movieTitle}</h4>

          <div className="card__meta">
            <span className="card__match">{Math.floor(Math.random() * 15 + 85)}% Match</span>
            <span className="card__rating">{movie.adult ? '18+' : 'U/A 16+'}</span>
            <span>{movie.release_date ? movie.release_date.substring(0, 4) : (movie.first_air_date ? movie.first_air_date.substring(0, 4) : '2024')}</span>
          </div>

          <div className="card__genres">
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {index < genres.length - 1 && <span className="card__genre-dot">•</span>}
                </React.Fragment>
              ))
            ) : (
              <span>Top Pick</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
