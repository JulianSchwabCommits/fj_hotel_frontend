import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'

import Homepage from './components/Homepage/Homepage'
import MeetingRoom from './components/MeetingRoom/MeetingRoom'
import AboutUs from './components/AboutUs/AboutUs'
import RoomBooking from './components/RoomBooking/RoomBooking'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import RoomDisplay from './components/RoomDisplay/RoomDisplay'
import RoomFullView from './components/RoomFullView/RoomFullView'
import Checkout from './components/Checkout/Checkout'
import ErrorPage from './components/ErrorPage/ErrorPage'

import './App.css'

export default function App() {
  return (
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/meeting-room" element={<MeetingRoom />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/room-booking" element={<RoomBooking />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room-display" element={<RoomDisplay />} />
          <Route path="/room/:id" element={<RoomFullView />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </Router>
  )
}