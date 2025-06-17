import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa'
import './Homepage.css'

interface UserData {
  userId: number
  firstName: string
  lastName: string
  email: string
}

export default function Homepage() {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.menu-container')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
    setShowMenu(!showMenu)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setShowMenu(false)
  }

  return (
    <div className="homepage-container">
      <div className="top-menu">
        <div className="menu-container">
          <button className="menu-button" onClick={handleMenuClick}>
            <FaBars />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <div className="menu-item" onClick={() => navigate('/')}>Home</div>
              <div className="menu-item" onClick={() => navigate('/book')}>Book a Room</div>
              {currentUser ? (
                <>
                  <div className="menu-item" onClick={() => navigate('/orders')}>My Orders</div>
                  <div className="menu-item" onClick={handleLogout}>Logout</div>
                </>
              ) : (
                <div className="menu-item" onClick={() => navigate('/auth')}>Login / Register</div>
              )}
            </div>
          )}
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