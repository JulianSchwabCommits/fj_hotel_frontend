import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Homepage from './components/Homepage/Homepage'
import Book from './components/Book/Book'
import Auth from './components/Auth/Auth'
import Orders from './components/Orders/Orders'

import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage route without navbar */}
        <Route path="/" element={<Homepage />} />
        
        {/* Auth route without navbar */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Book route in full view (without navbar and main container) */}
        <Route path="/book" element={<Book />} />
        
        {/* Orders route for logged in users */}
        <Route path="/orders" element={<Orders />} />
          
        {/* Redirects for backward compatibility */}
        <Route path="/meeting-room" element={<Book />} />
        <Route path="/room-booking" element={<Book />} />
        <Route path="/room-display" element={<Book />} />
      </Routes>
    </Router>
  )
}