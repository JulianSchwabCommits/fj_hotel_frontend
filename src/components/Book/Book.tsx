import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import './Book.css'

const API_BASE = 'http://localhost:8080'

interface SearchParams {
  checkinDate: string
  checkoutDate: string
  capacity: number
  roomType: string
  category: string
}

interface RoomData {
  roomId: number
  roomName: string
  roomType: string
  category: string
  capacity: number
  price: number
  description?: string
}

interface UserData {
  userId: number
  firstName: string
  lastName: string
  email: string
}

type BookingStep = 'search' | 'select' | 'confirm'

export default function Book() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [currentStep, setCurrentStep] = useState<BookingStep>('search')
  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkinDate: '',
    checkoutDate: '',
    capacity: 1,
    roomType: '',
    category: ''
  })
  const [availableRooms, setAvailableRooms] = useState<RoomData[]>([])
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      // Redirect to auth page if not logged in
      navigate('/auth', { state: { from: location.pathname + location.search } })
      return
    }

    // Set default dates (tomorrow and day after)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)
    
    setSearchParams(prev => ({
      ...prev,
      checkinDate: tomorrow.toISOString().slice(0, 10), // YYYY-MM-DD format
      checkoutDate: dayAfter.toISOString().slice(0, 10)
    }))

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.menu-container')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [location, navigate])

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setSearchParams({
      ...searchParams,
      [id]: id === 'capacity' ? parseInt(value) : value
    })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchParams.checkinDate || !searchParams.checkoutDate) {
      setError('Please select check-in and check-out dates')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Convert dates to datetime format for API (check-in at 13:00, check-out at 10:00)
      const checkinDateTime = searchParams.checkinDate + 'T13:00:00'
      const checkoutDateTime = searchParams.checkoutDate + 'T10:00:00'
      
      let url = `${API_BASE}/rooms/available?checkin_date=${encodeURIComponent(checkinDateTime)}&checkout_date=${encodeURIComponent(checkoutDateTime)}`
      
      if (searchParams.capacity > 1) url += `&capacity=${searchParams.capacity}`
      if (searchParams.roomType) url += `&room_type=${searchParams.roomType}`
      if (searchParams.category) url += `&category=${searchParams.category}`
      
      console.log('Searching rooms with URL:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setAvailableRooms(data)
        setCurrentStep('select')
      } else {
        console.error('Server response:', data)
        setError('Failed to fetch available rooms')
      }
    } catch (err) {
      console.error('Error searching rooms:', err)
      setError('Network error. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoom = (room: RoomData) => {
    setSelectedRoom(room)
    setCurrentStep('confirm')
  }

  const handleConfirmBooking = async () => {
    if (!currentUser || !selectedRoom) return
    
    const orderData = {
      userId: currentUser.userId,
      roomId: selectedRoom.roomId,
      checkinDate: searchParams.checkinDate + 'T13:00:00',
      checkoutDate: searchParams.checkoutDate + 'T10:00:00',
      paymentMethod: 'credit_card'
    }
    
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Navigate to success page or show success message
        alert('Booking confirmed successfully!')
        navigate('/')
      } else {
        setError(data.message || 'Booking failed')
      }
    } catch (err) {
      setError('Network error during booking')
    } finally {
      setLoading(false)
    }
  }

  const goBackToSearch = () => {
    setCurrentStep('search')
    setAvailableRooms([])
    setSelectedRoom(null)
    setError(null)
  }

  const goBackToSelection = () => {
    setCurrentStep('select')
    setSelectedRoom(null)
    setError(null)
  }

  const formatValue = (str: string) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ')
  }

  const getRoomImage = (roomType: string, category: string) => {
    // Map room types to image folder names
    const typeMap: Record<string, string> = {
      'room': 'Room',
      'meeting_room': 'Meetingroom'
    }
    
    // Map categories to image folder names
    const categoryMap: Record<string, string> = {
      'standard': 'Standard',
      'deluxe': 'Deluxe',
      'suite': 'Suite'
    }
    
    const imageType = typeMap[roomType] || 'Room'
    const imageCategory = categoryMap[category] || 'Standard'
    
    // Determine file extension based on category and type
    let extension = 'jpg'
    if (imageCategory === 'Deluxe' && imageType === 'Room') extension = 'webp'
    if (imageCategory === 'Suite' && imageType === 'Meetingroom') extension = 'webp'
    
    // Return the first image for each combination
    return `/Images/${imageCategory}-${imageType}-1.${extension}`
  }

  return (
    <div className="book-container">
      {/* Header */}
      <div className="book-header">
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

      <div className="book-content">
        <h1 className="page-title">Room Booking</h1>
        
        {error && <div className="error-message">{error}</div>}

        {/* Step 1: Search Form */}
        {currentStep === 'search' && (
          <div className="search-section">
            <h2 className="search-title">Search for Available Rooms</h2>
            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkinDate">Check-in Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="checkinDate"
                    value={searchParams.checkinDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="time-info">Check-in time: 13:00</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="checkoutDate">Check-out Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="checkoutDate"
                    value={searchParams.checkoutDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="time-info">Check-out time: 10:00</span>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacity">Minimum Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    max="10"
                    value={searchParams.capacity}
                    onChange={handleChange}
                    placeholder="Number of guests"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="roomType">Room Type</label>
                  <select id="roomType" value={searchParams.roomType} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="room">Guest Room</option>
                    <option value="meeting_room">Meeting Room</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" value={searchParams.category} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
              
              <div className="search-button-container">
                <button 
                  type="button" 
                  className="search-button" 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? 'Searching Available Rooms...' : 'Search Available Rooms'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Room Selection */}
        {currentStep === 'select' && (
          <div className="selection-section">
            <button className="back-button" onClick={goBackToSearch}>
              ← Back to Search
            </button>
            
            <h3>Available Rooms</h3>
            
            <div className="rooms-grid">
              {availableRooms.map(room => (
                <div key={room.roomId} className="room-card">
                  <div className="room-image">
                    <img 
                      src={getRoomImage(room.roomType, room.category)} 
                      alt={`${formatValue(room.category)} ${formatValue(room.roomType)}`}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none'
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                    <div className="room-placeholder" style={{ display: 'none' }}>
                      IMG
                    </div>
                  </div>
                  <div className="room-info">
                    <h3 className="room-title">{room.roomName}</h3>
                    <p className="room-details"><strong>Type:</strong> {formatValue(room.roomType)}</p>
                    <p className="room-details"><strong>Category:</strong> {formatValue(room.category)}</p>
                    <p className="room-details"><strong>Capacity:</strong> {room.capacity} people</p>
                    <p className="room-details room-price">${room.price} per night</p>
                    <button 
                      className="book-button"
                      onClick={() => handleSelectRoom(room)}
                    >
                      Book This Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {availableRooms.length === 0 && !loading && (
              <div className="no-results">No rooms available for your search criteria.</div>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 'confirm' && selectedRoom && (
          <div className="confirmation-section">
            <button className="back-button" onClick={goBackToSelection}>
              ← Back to Room Selection
            </button>
            
            <div className="confirmation-details">
              <div className="confirmation-card">
                <h2>Booking Confirmation</h2>
                
                <div className="details-section">
                  <h3>Guest Information</h3>
                  <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                </div>
                
                <div className="details-section">
                  <h3>Room Details</h3>
                  <p><strong>Room:</strong> {selectedRoom.roomName}</p>
                  <p><strong>Type:</strong> {formatValue(selectedRoom.roomType)}</p>
                  <p><strong>Category:</strong> {formatValue(selectedRoom.category)}</p>
                  <p><strong>Capacity:</strong> {selectedRoom.capacity} persons</p>
                  <p><strong>Price:</strong> ${selectedRoom.price} per night</p>
                </div>
                
                <div className="details-section">
                  <h3>Booking Details</h3>
                  <p><strong>Check-in:</strong> {searchParams.checkinDate} at 13:00</p>
                  <p><strong>Check-out:</strong> {searchParams.checkoutDate} at 10:00</p>
                  <p><strong>Payment Method:</strong> Credit Card</p>
                </div>
                
                <div className="confirmation-actions">
                  <button 
                    className="confirm-button" 
                    onClick={handleConfirmBooking}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
