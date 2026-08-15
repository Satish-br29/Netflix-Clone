import React, { useState, useEffect } from 'react';
import BrowseNavbar from '../../components/Navbar/BrowseNavbar';
import BrowseHero from '../../components/HeroBanner/BrowseHero';
import Row from '../../components/Row/Row';
import Card from '../../components/Row/Card';
import Modal from '../../components/Modal/Modal';
import tmdb, { requests } from '../../services/tmdb';
import { useMyList } from '../../context/MyListContext';

const languagesList = [
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { myList } = useMyList();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await tmdb.get(`/search/multi?query=${encodeURIComponent(searchQuery.trim())}`);
        const validResults = (res.data.results || []).filter(
          (item) => (item.poster_path || item.backdrop_path) && (item.media_type === 'movie' || item.media_type === 'tv')
        );
        setSearchResults(validResults);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', overflowX: 'hidden', color: '#fff' }}>
      <BrowseNavbar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ─── 1. Search Results View ─── */}
      {searchQuery.trim() ? (
        <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh', paddingLeft: 'var(--row-pad)', paddingRight: 'var(--row-pad)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#e5e5e5' }}>
            {searchLoading ? `Searching for "${searchQuery}"...` : `Results for "${searchQuery}"`}
          </h2>

          {searchLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card card--skeleton skeleton-shimmer" style={{ aspectRatio: '16/9', borderRadius: '4px' }} />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {searchResults.map((item) => (
                <Card key={item.id} movie={item} onClick={() => handleCardClick(item)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8c8c8c' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your search for "{searchQuery}" did not have any matches.</p>
              <p style={{ fontSize: '0.95rem' }}>Suggestions: Try different keywords, check for spelling, or search for a popular title.</p>
            </div>
          )}
        </div>
      ) : activeTab === 'mylist' ? (
        /* ─── 2. My List Tab View ─── */
        <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh', paddingLeft: 'var(--row-pad)', paddingRight: 'var(--row-pad)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '28px' }}>My List</h1>
          {myList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {myList.map((item) => (
                <Card key={item.id} movie={item} onClick={() => handleCardClick(item)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#8c8c8c' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎬</div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>Your list is empty</h2>
              <p style={{ fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                Add movies and TV shows to your list by clicking the <strong>+</strong> button on any title to watch them later.
              </p>
            </div>
          )}
        </div>
      ) : activeTab === 'language' ? (
        /* ─── 3. Browse by Language Tab View ─── */
        <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh' }}>
          <div style={{ paddingLeft: 'var(--row-pad)', paddingRight: 'var(--row-pad)', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px' }}>Browse by Language</h1>
            
            {/* Language Selector Chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    backgroundColor: selectedLanguage === lang.code ? '#e50914' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid ' + (selectedLanguage === lang.code ? '#e50914' : 'rgba(255,255,255,0.2)'),
                    fontSize: '0.9rem',
                    fontWeight: selectedLanguage === lang.code ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <Row
            title={`Top Popular in ${languagesList.find(l => l.code === selectedLanguage)?.name || 'Selected'}`}
            fetchUrl={`/discover/movie?with_original_language=${selectedLanguage}&sort_by=popularity.desc`}
            onCardClick={handleCardClick}
          />
          <Row
            title={`Top Rated ${languagesList.find(l => l.code === selectedLanguage)?.name || ''} Cinema`}
            fetchUrl={`/discover/movie?with_original_language=${selectedLanguage}&sort_by=vote_average.desc&vote_count.gte=50`}
            onCardClick={handleCardClick}
          />
          <Row
            title={`${languagesList.find(l => l.code === selectedLanguage)?.name || ''} Action & Thrillers`}
            fetchUrl={`/discover/movie?with_original_language=${selectedLanguage}&with_genres=28,53`}
            onCardClick={handleCardClick}
          />
          <Row
            title={`${languagesList.find(l => l.code === selectedLanguage)?.name || ''} Comedies & Family`}
            fetchUrl={`/discover/movie?with_original_language=${selectedLanguage}&with_genres=35,10751`}
            onCardClick={handleCardClick}
          />
        </div>
      ) : activeTab === 'tv' ? (
        /* ─── 4. TV Shows Tab View ─── */
        <>
          <BrowseHero 
            fetchUrl={requests.fetchTrendingTv} 
            onPlayClick={handleCardClick} 
            onMoreInfoClick={handleCardClick} 
          />
          <div style={{ paddingBottom: '40px' }}>
            <Row title="Trending TV Shows" fetchUrl={requests.fetchTrendingTv} isOverlap={true} onCardClick={handleCardClick} />
            <Row title="Netflix Original Series" fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} onCardClick={handleCardClick} />
            <Row title="Top Rated TV Shows" fetchUrl={requests.fetchTopRatedTv} onCardClick={handleCardClick} />
            <Row title="Action & Adventure TV" fetchUrl={requests.fetchActionTv} onCardClick={handleCardClick} />
            <Row title="Binge-worthy Comedy Series" fetchUrl={requests.fetchComedyTv} onCardClick={handleCardClick} />
            <Row title="Dramatic Series" fetchUrl={requests.fetchDramaTv} onCardClick={handleCardClick} />
            <Row title="Mystery & Thriller Shows" fetchUrl={requests.fetchMysteryTv} onCardClick={handleCardClick} />
          </div>
        </>
      ) : activeTab === 'movies' ? (
        /* ─── 5. Movies Tab View ─── */
        <>
          <BrowseHero 
            fetchUrl={requests.fetchTrendingMovies} 
            onPlayClick={handleCardClick} 
            onMoreInfoClick={handleCardClick} 
          />
          <div style={{ paddingBottom: '40px' }}>
            <Row title="Trending Movies" fetchUrl={requests.fetchTrendingMovies} isOverlap={true} onCardClick={handleCardClick} />
            <Row title="Top Rated Movies" fetchUrl={requests.fetchTopRated} onCardClick={handleCardClick} />
            <Row title="Action Blockbusters" fetchUrl={requests.fetchActionMovies} onCardClick={handleCardClick} />
            <Row title="Comedy Hits" fetchUrl={requests.fetchComedyMovies} onCardClick={handleCardClick} />
            <Row title="Sci-Fi & Fantasy Movies" fetchUrl={requests.fetchSciFiMovies} onCardClick={handleCardClick} />
            <Row title="Suspense & Thrillers" fetchUrl={requests.fetchThrillerMovies} onCardClick={handleCardClick} />
            <Row title="Animation Films" fetchUrl={requests.fetchAnimationMovies} onCardClick={handleCardClick} />
          </div>
        </>
      ) : activeTab === 'new' ? (
        /* ─── 6. New & Popular Tab View ─── */
        <>
          <BrowseHero 
            fetchUrl={requests.fetchNowPlaying} 
            onPlayClick={handleCardClick} 
            onMoreInfoClick={handleCardClick} 
          />
          <div style={{ paddingBottom: '40px' }}>
            <Row title="Now Playing in Theatres" fetchUrl={requests.fetchNowPlaying} isOverlap={true} onCardClick={handleCardClick} />
            <Row title="Upcoming Releases" fetchUrl={requests.fetchUpcoming} onCardClick={handleCardClick} />
            <Row title="Airing Today on TV" fetchUrl={requests.fetchAiringToday} onCardClick={handleCardClick} />
            <Row title="Top 10 This Week" fetchUrl={requests.fetchTrending} onCardClick={handleCardClick} />
            <Row title="On The Air" fetchUrl={requests.fetchOnTheAir} onCardClick={handleCardClick} />
          </div>
        </>
      ) : (
        /* ─── 7. Default Home Tab View ─── */
        <>
          <BrowseHero 
            fetchUrl={requests.fetchTrending} 
            onPlayClick={handleCardClick} 
            onMoreInfoClick={handleCardClick} 
          />
          <div style={{ paddingBottom: '40px' }}>
            <Row title="Trending Now" fetchUrl={requests.fetchTrending} isOverlap={true} onCardClick={handleCardClick} />
            <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} onCardClick={handleCardClick} />
            <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onCardClick={handleCardClick} />
            <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onCardClick={handleCardClick} />
            <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onCardClick={handleCardClick} />
            <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onCardClick={handleCardClick} />
            <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onCardClick={handleCardClick} />
          </div>
        </>
      )}

      {selectedMovie && <Modal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
