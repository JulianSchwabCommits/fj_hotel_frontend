import { useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import './Homepage.css'

export default function Homepage() {
  const navigate = useNavigate()

  const handleBookClick = () => {
    // Check if user is logged in before navigating
    const user = localStorage.getItem('currentUser')
    if (user) {
      navigate('/book')
    } else {
      navigate('/auth', { state: { from: '/book' } })
    }
  }

  const handleMenuClick = () => {
    // This would toggle a menu in a real implementation
    console.log('Menu clicked')
  }

  return (
    <div className="homepage-container">
      <div className="top-menu">
        <button className="menu-button" onClick={handleMenuClick}>
          <FaBars />
        </button>
        <div className="menu-items">
          <div className="menu-item" onClick={() => navigate('/book')}>Book a Room</div>
          <div className="menu-item" onClick={() => navigate('/auth')}>Login / Register</div>
        </div>
      </div>
      
      <div className="hotel-content">
        <h1 className="hotel-name">Hotel</h1>
        <h2 className="hotel-subtitle">FJ</h2>
        <div className="hotel-images">
          <img 
            src="Images/Website/image.png" 
            alt="Hotel Exterior" 
            className="hotel-image exterior"
          />
          <img 
            src="Images/Website/Lamp.png" 
            alt="Hotel Interior" 
            className="hotel-image interior"
          />
        </div>
      </div>
      
      <div className="book-sidebar" onClick={handleBookClick}>
        <div className="book-text">BOOK</div>
      </div>
    </div>
  )
}