import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Book.css'

type RoomCategory = 'standard' | 'deluxe' | 'suite'

interface SearchParams {
  checkIn: string
  checkOut: string
  roomType: string
  persons: number
}

interface RoomData {
  id: number
  name: string
  category: RoomCategory
  capacity: number
  price: number
  imageUrl: string
  available: boolean
}

export default function Book() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkIn: '',
    checkOut: '',
    roomType: 'All',
    persons: 1
  })
  const [availableRooms, setAvailableRooms] = useState<RoomData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser')
    if (user) {
      setIsLoggedIn(true)
    } else {
      // Redirect to auth page if not logged in
      navigate('/auth', { state: { from: location.pathname + location.search } })
      return
    }
  }, [location, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setSearchParams({
      ...searchParams,
      [id]: value === 'persons' ? parseInt(value) : value
    })
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    try {
      // Simulate API call for available rooms
      setTimeout(() => {
        const mockRooms: RoomData[] = [
          {
            id: 1,
            name: 'Standard',
            category: 'standard',
            capacity: 2,
            price: 100,
            imageUrl: '/Images/Standard-Room-1.jpg',
            available: true
          },
          {
            id: 2,
            name: 'Standard',
            category: 'standard',
            capacity: 2,
            price: 100,
            imageUrl: '/Images/Standard-Room-2.jpg',
            available: true
          },
          {
            id: 3,
            name: 'Suite',
            category: 'suite',
            capacity: 4,
            price: 300,
            imageUrl: '/Images/Suite-Room-1.jpg',
            available: true
          },
          {
            id: 4,
            name: 'Deluxe',
            category: 'deluxe',
            capacity: 3,
            price: 200,
            imageUrl: '/Images/Deluxe-Room-1.webp',
            available: true
          }
        ]

        // Filter based on search criteria
        const filteredRooms = mockRooms.filter(room => {
          if (searchParams.roomType !== 'All' && room.category !== searchParams.roomType.toLowerCase()) return false
          if (room.capacity < searchParams.persons) return false
          return true
        })

        setAvailableRooms(filteredRooms)
        setLoading(false)
      }, 800)
    } catch (err) {
      setError('Error searching for available rooms')
      setLoading(false)
    }
  }

  const handleBookRoom = (roomId: number) => {
    if (!isLoggedIn) {
      navigate('/auth', { state: { from: `/book?roomId=${roomId}` } })
    } else {
      navigate(`/checkout?roomId=${roomId}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`)
    }
  }

  return (
    <div className="book-container">
      <div className="book-header">
        <div className="header-bar">
          <div className="hotel-title">
            <span className="hotel-main">Hotel</span>
            <span className="hotel-sub">FJ</span>
          </div>
          <div className="home-indicator">HOME</div>
        </div>
      </div>
      
      <div className="book-content">
        <h1 className="page-title">Room Booking</h1>
        
        <div className="search-section">
          <div className="search-row">
            <div className="form-group">
              <label>Check-in</label>
              <input
                type="date"
                id="checkIn"
                value={searchParams.checkIn}
                onChange={handleChange}
                placeholder="dd.mm.yy"
              />
            </div>
            
            <div className="form-group">
              <label>Check-out</label>
              <input
                type="date"
                id="checkOut"
                value={searchParams.checkOut}
                onChange={handleChange}
                placeholder="dd.mm.yy"
              />
            </div>
          </div>
          
          <div className="search-row">
            <div className="form-group">
              <label>Room Type</label>
              <select id="roomType" value={searchParams.roomType} onChange={handleChange}>
                <option value="All">All</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Persons</label>
              <input
                type="number"
                id="persons"
                min="1"
                value={searchParams.persons}
                onChange={handleChange}
              />
            </div>
            
            <button 
              type="button" 
              className="search-button" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {hasSearched && !loading && (
          <div className="rooms-grid">
            {availableRooms.map(room => (
              <div key={room.id} className="room-card">
                <div 
                  className="room-image" 
                  style={{ backgroundImage: `url(${room.imageUrl})` }}
                >
                  <div className="room-label">IMG</div>
                </div>
                <div className="room-info">
                  <h3 className="room-name">{room.name}</h3>
                  <p className="room-capacity">Capacity: {room.capacity}</p>
                  <p className="room-price">Price: {room.price}.-</p>
                  <button 
                    className="book-now-button" 
                    onClick={() => handleBookRoom(room.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hasSearched && !loading && availableRooms.length === 0 && (
          <div className="no-results">No rooms available for your search criteria.</div>
        )}
      </div>
    </div>
  )
}
