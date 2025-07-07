import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./components/Navbar";
import News from "./components/news/News";

export default function App() {
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('cwz_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [category, setCategory] = useState('general');

  const categories = [
    'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'
  ];

  // Add or remove bookmark
  const handleBookmark = (article) => {
    setBookmarks(prev => {
      const exists = prev.some(a => a.url === article.url);
      let updated;
      if (exists) {
        updated = prev.filter(a => a.url !== article.url);
      } else {
        updated = [...prev, article];
      }
      localStorage.setItem('cwz_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Check if an article is bookmarked
  const isBookmarked = (article) => bookmarks.some(a => a.url === article.url);

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      <Router>
        <Navbar
          onSearch={setSearch}
          onToggleDarkMode={() => setDarkMode(dm => !dm)}
          darkMode={darkMode}
        />
        <div className="categories-filter" style={{textAlign: 'center', margin: '1rem 0'}}>
          {categories.map(cat => (
            <button
              key={cat}
              className={cat === category ? 'active' : ''}
              onClick={() => setCategory(cat)}
              style={{margin: '0 0.5rem'}}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <Routes>
          <Route path="/" element={
            <News
              category={category}
              search={search}
              onBookmark={handleBookmark}
              isBookmarked={isBookmarked}
              bookmarks={bookmarks}
              key={category}
              apiKey={process.env.REACT_APP_NEWS_API}
              pageSize={12}
              country="us"
            />
          } />
          <Route path="/bookmarks" element={
            <News
              articles={bookmarks}
              onBookmark={handleBookmark}
              isBookmarked={isBookmarked}
              bookmarks={bookmarks}
              showOnlyBookmarks={true}
            />
          } />
          <Route path="/about" element={<div>About CodeWithZodi (Coming soon)</div>} />
        </Routes>
      </Router>
    </div>
  );
}
