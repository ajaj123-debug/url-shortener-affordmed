import { Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ShortenerPage from './pages/ShortenerPage.jsx'
import StatisticsPage from './pages/StatisticsPage.jsx'
import RedirectHandler from './pages/RedirectHandler.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<ShortenerPage />} />
      <Route path="/stats" element={<StatisticsPage />} />
      <Route path="/:shortcode" element={<RedirectHandler />} />
    </Routes>
  )
}

export default App
