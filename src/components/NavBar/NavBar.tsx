import { Link } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Homepage</Link></li>
        <li><Link to="/room-booking">Room Booking</Link></li>
        <li><Link to="/meeting-room">Meeting Room</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/sign-in">Sign In</Link></li>
        
      </ul>
    </nav>
  )
}