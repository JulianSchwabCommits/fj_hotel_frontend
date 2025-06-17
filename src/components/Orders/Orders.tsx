import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import './Orders.css'

const API_BASE = 'http://localhost:8080'

interface OrderData {
  orderId: number
  userId: number
  roomId: number
  roomName: string
  roomType?: string
  category?: string
  checkinDate: string
  checkoutDate: string
  totalPrice?: number
  status: string
  paymentMethod: string
  createdAt: string
  bookingDate?: string // For backward compatibility
  capacity?: number
  pricePerNight?: number
  message?: string
  success?: boolean
}

interface UserData {
  userId: number
  firstName: string
  lastName: string
  email: string
}

export default function Orders() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
      fetchOrders(JSON.parse(user).userId)
    } else {
      // Redirect to auth page if not logged in
      navigate('/auth', { state: { from: '/orders' } })
      return
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
  }, [navigate])

  const fetchOrders = async (userId: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/orders/user/${userId}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('Server response:', data)
        setError('Failed to fetch orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Network error. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    
    try {
      // Handle different date formats from backend
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return 'Invalid Date'
    }
  }

  const formatValue = (str: string) => {
    if (!str) return 'N/A'
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
  }

  const cancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh orders list
        if (currentUser) {
          await fetchOrders(currentUser.userId)
        }
      } else {
        setError(data.message || 'Failed to cancel order')
      }
    } catch (err) {
      console.error('Error canceling order:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
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
        <div className="hotel-title">
          <span className="hotel-main">Hotel</span>
          <span className="hotel-sub">FJ</span>
        </div>
        <div className="home-indicator" onClick={() => navigate('/')}>HOME</div>
      </div>

      <div className="orders-content">
        <h1 className="page-title">My Bookings</h1>
        
        {currentUser && (
          <div className="user-info">
            <h3>Welcome, {currentUser.firstName} {currentUser.lastName}</h3>
            <p>Email: {currentUser.email}</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading your bookings...</div>
        ) : (
          <div className="orders-section">
            {orders.length === 0 ? (
              <div className="no-orders">
                <h3>No bookings found</h3>
                <p>You haven't made any bookings yet.</p>
                <button className="book-now-button" onClick={() => navigate('/book')}>
                  Book a Room Now
                </button>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map(order => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <h3 className="room-name">{order.roomName}</h3>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {formatValue(order.status)}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <div className="detail-row">
                        <span className="label">Order ID:</span>
                        <span className="value">{order.orderId}</span>
                      </div>
                      {order.roomType && (
                        <div className="detail-row">
                          <span className="label">Room Type:</span>
                          <span className="value">{formatValue(order.roomType)}</span>
                        </div>
                      )}
                      {order.category && (
                        <div className="detail-row">
                          <span className="label">Category:</span>
                          <span className="value">{formatValue(order.category)}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="label">Payment Method:</span>
                        <span className="value">{formatValue(order.paymentMethod)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Check-in:</span>
                        <span className="value">{formatDate(order.checkinDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Check-out:</span>
                        <span className="value">{formatDate(order.checkoutDate)}</span>
                      </div>
                      {order.totalPrice && (
                        <div className="detail-row">
                          <span className="label">Total Price:</span>
                          <span className="value price">${order.totalPrice}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="label">Booked on:</span>
                        <span className="value">{formatDate(order.bookingDate || order.createdAt)}</span>
                      </div>
                    </div>
                    
                    {order.status.toLowerCase() === 'pending' && (
                      <div className="order-actions">
                        <button 
                          className="cancel-button"
                          onClick={() => cancelOrder(order.orderId)}
                          disabled={loading}
                        >
                          {loading ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
