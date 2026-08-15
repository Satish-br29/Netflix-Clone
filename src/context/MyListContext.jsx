import { createContext, useContext, useState, useEffect } from 'react';

const MyListContext = createContext();

export function MyListProvider({ children }) {
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('netflix_mylist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('netflix_mylist', JSON.stringify(myList));
  }, [myList]);

  const addToList = (movie) => {
    if (!movie) return;
    setMyList((prev) => {
      if (prev.some((item) => item.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFromList = (movieId) => {
    setMyList((prev) => prev.filter((item) => item.id !== movieId));
  };

  const toggleList = (movie) => {
    if (!movie) return;
    if (isInList(movie.id)) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  const isInList = (movieId) => {
    return myList.some((item) => item.id === movieId);
  };

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, toggleList, isInList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
}
