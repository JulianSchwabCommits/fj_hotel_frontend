import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'

import Homepage from './components/Homepage/Homepage'
import Book from './components/Book/Book'
import Auth from './components/Auth/Auth'
import RoomDisplay from './components/RoomDisplay/RoomDisplay'
import RoomFullView from './components/RoomFullView/RoomFullView'
import Checkout from './components/Checkout/Checkout'
// We no longer need these imports as we're redirecting to the Book component
// import MeetingRoom from './components/MeetingRoom/MeetingRoom'
// import RoomBooking from './components/RoomBooking/RoomBooking'

import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage route without navbar */}
        <Route path="/" element={<Homepage />} />
        
        {/* Auth route without navbar (similar to homepage) */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Routes with navbar */}
        <Route path="/book" element={<><NavBar /><main><Book /></main></>} />
        <Route path="/room-display" element={<><NavBar /><main><RoomDisplay /></main></>} />
        <Route path="/room/:id" element={<><NavBar /><main><RoomFullView /></main></>} />
        <Route path="/checkout" element={<><NavBar /><main><Checkout /></main></>} />
          
        {/* Redirects for backward compatibility */}
        <Route path="/meeting-room" element={<><NavBar /><main><Book /></main></>} />
        <Route path="/room-booking" element={<><NavBar /><main><Book /></main></>} />
          

      </Routes>
    </Router>
  )
}