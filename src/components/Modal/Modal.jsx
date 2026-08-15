import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tmdb from '../../services/tmdb';
import { useMyList } from '../../context/MyListContext';
import './Modal.css';

const baseImageUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function Modal({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const { toggleList, isInList } = useMyList();
  const inList = movie?.id ? isInList(movie.id) : false;

  // Genre map to resolve IDs
  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10765: 'Sci-Fi & Fantasy'
  };

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    async function fetchTrailer() {
      try {
        const type = movie.media_type === 'tv' ? 'tv' : 'movie';
        let response = await tmdb.get(`/${type}/${movie.id}/videos`);
        
        if (response.data.results.length === 0 && !movie.media_type) {
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
        console.error("Failed to fetch trailer for modal", error);
      }
    }

    if (movie) fetchTrailer();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  const backdropPath = movie.backdrop_path || movie.poster_path;
  const title = movie.title || movie.name || movie.original_name;
  const genres = movie.genre_ids ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean) : [];

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <button className="modal__close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="modal__hero">
            {trailerKey ? (
              <iframe 
                className="modal__hero-video"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}&showinfo=0&rel=0`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img 
                className="modal__hero-image"
                src={`${baseImageUrl}/original${backdropPath}`} 
                alt={title} 
              />
            )}
            <div className="modal__hero-overlay" />
            
            <div className="modal__hero-content">
              <h1 className="modal__title">{title}</h1>
              <div className="modal__buttons">
                <button className="btn-netflix-play">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </button>
                <button 
                  className={`card__btn ${inList ? 'card__btn--active' : ''}`} 
                  style={{width: '40px', height: '40px'}}
                  onClick={() => toggleList(movie)}
                  title={inList ? "Remove from My List" : "Add to My List"}
                >
                  {inList ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
                <div className="card__btn" style={{width: '40px', height: '40px'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="modal__body">
            <div className="modal__body-left">
              <div className="modal__meta">
                <span className="modal__match">{Math.floor(Math.random() * 20 + 80)}% Match</span>
                <span>{movie.release_date ? movie.release_date.substring(0,4) : '2024'}</span>
                <span className="modal__rating">TV-MA</span>
                <span>{Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}m</span>
              </div>
              <p className="modal__overview">{movie.overview}</p>
            </div>
            
            <div className="modal__body-right">
              <div className="modal__info-list">
                <div className="modal__info-item">
                  Cast: <span>Unknown (TMDB needs credits endpoint)</span>
                </div>
                <div className="modal__info-item">
                  Genres: <span>{genres.length > 0 ? genres.join(', ') : 'Various'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
