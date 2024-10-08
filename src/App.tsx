import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Game from './pages/Game';
import Home from './pages/Home';
import HistoryPage from './pages/History';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
