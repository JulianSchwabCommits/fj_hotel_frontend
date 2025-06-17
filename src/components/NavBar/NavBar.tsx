import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function NavBar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in on mount and when localStorage changes
    const checkUserLogin = () => {
      const userJson = localStorage.getItem('currentUser')
      if (userJson) {
        try {
          const user = JSON.parse(userJson)
          setCurrentUser(user)
        } catch (e) {
          console.error('Failed to parse user data', e)
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }

    checkUserLogin()

    // Listen for storage events (when user logs in/out in another tab)
    window.addEventListener('storage', checkUserLogin)
    
    return () => {
      window.removeEventListener('storage', checkUserLogin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/book">Book</Link></li>
        
        {currentUser ? (
          <>
            <li className="user-menu">
              <span className="welcome-text">Hello, {currentUser.firstName}</span>
              <div className="dropdown-content">
                <Link to="/profile">My Profile</Link>
                <Link to="/bookings">My Bookings</Link>
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            </li>
          </>
        ) : (
          <li><Link to="/sign-in">Sign In</Link></li>
        )}
      </ul>
    </nav>
  )
}