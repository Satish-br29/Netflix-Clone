import React, { useState, useEffect, useRef } from 'react';
import tmdb from '../../services/tmdb';
import Card from './Card';
import './Row.css';

export default function Row({ title, fetchUrl, isLargeRow = false, isOverlap = false, onCardClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await tmdb.get(fetchUrl);
        setMovies(request.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TMDB data for row:", title, error);
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl, title]);

  const postersRef = useRef(null);

  // Auto-scroll rows every 8 seconds
  useEffect(() => {
    if (loading) return;
    const intervalId = setInterval(() => {
      if (!postersRef.current) return;
      const { scrollLeft, clientWidth, scrollWidth } = postersRef.current;
      if (scrollLeft + clientWidth >= scrollWidth) {
        // Reset to start
        postersRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll by a fixed amount (e.g., 300px)
        postersRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 8000);
    return () => clearInterval(intervalId);
  }, [loading, movies]);

  return (
    <div className={`row ${isOverlap ? 'row--overlap' : ''}`}>
      <h2 className="row__title">
        {title}
        <span className="row__title-explore">Explore All &gt;</span>
      </h2>

      <div className="row__posters" ref={postersRef}>
        {loading ? (
          // Skeleton loading
          Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className={`card card--skeleton ${isLargeRow ? 'card__poster--portrait' : ''} skeleton-shimmer`}
            />
          ))
        ) : (
          movies.map(movie => (
            <Card 
              key={movie.id} 
              movie={movie} 
              isLargeRow={isLargeRow} 
              onClick={() => onCardClick(movie)}
            />
          ))
        )}
      </div>
    </div>
  );
}
