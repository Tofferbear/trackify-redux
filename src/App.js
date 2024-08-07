import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authorize from './features/auth/Authorize';
import RecentPlaysFetcher from './features/spotify/RecentPlaysFetcher';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authorize />} />
        <Route path="/api/spotify-callback" element={<Authorize />} />
      </Routes>
      <RecentPlaysFetcher playsToFetch={50} />
    </Router>
  );
}
