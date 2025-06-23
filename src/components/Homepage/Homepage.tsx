import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
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
  const [scrollY, setScrollY] = useState<number>(0)
  const [showStory, setShowStory] = useState<boolean>(false)
  const [showHistoryImage, setShowHistoryImage] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Handle scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrollY(scrollPosition)
      
      // Show story section when scrolled 400px (reduced from 600px)
      if (scrollPosition > 400) {
        setShowStory(true)
      }
      
      // Show history image when scrolled 600px (reduced from 1000px)
      if (scrollPosition > 600) {
        setShowHistoryImage(true)
      }
    }

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.menu-container')) {
        setShowMenu(false)
      }
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClickOutside)
    
    // Call handleScroll once to set initial state
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
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
    <div className="homepage-container" ref={containerRef}>
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
                <div className="menu-item" onClick={() => navigate('/auth', { state: { from: '/' } })}>Login / Register</div>
              )}
            </div>
          )}
        </div>
        <div className="book-text-corner" onClick={handleBookClick}>
          BOOK
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
            style={{
              transform: `translateY(-${scrollY * 0.5}px)`, // Reduced from 0.8 to 0.5
              transition: 'transform 0.2s ease-out' // Slightly slower transition
            }}
          />
        </div>
      </div>
      
      <div className={`our-story-section ${showStory ? 'visible' : ''}`}>
        <div className="story-content">
          <h2 className="story-title">Our Story</h2>
          <p className="story-description">
            FJ Hotel began in 1954 as a small guesthouse founded by Frederick and Joanna Langston, 
            who believed great hospitality was about more than luxury, it was about care, consistency, 
            and character. What started with just 12 rooms quickly earned a reputation for thoughtful 
            service and lasting comfort. Over the decades, FJ Hotel grew, adapted, and modernized, 
            but never lost its original spirit. Still family-owned and fiercely independent, we remain 
            committed to offering timeless hospitality in a world that moves too fast.
          </p>
        </div>
        <div className={`history-image-container ${showHistoryImage ? 'visible' : ''}`}>
          <img 
            src="Images/Website/history.jpg" 
            alt="Hotel History" 
            className="history-image"
          />
        </div>
      </div>
    </div>
  )
}