import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import './Auth.css'

const API_BASE = 'http://localhost:8080'

type AuthView = 'login' | 'register'

interface RegisterFormState {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthdate: string
  address: string
  password: string
  confirmPassword: string
}

interface LoginFormState {
  email: string
  password: string
}

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeView, setActiveView] = useState<AuthView | 'forgot-password'>('login')
  
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: '',
    password: ''
  })

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    newPassword: ''
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthdate: '',
    address: '',
    password: '',
    confirmPassword: ''
  })

  // Form submission states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleMenuClick = () => {
    // This would toggle a menu in a real implementation
    console.log('Menu clicked')
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setLoginForm({
      ...loginForm,
      [id]: value
    })
  }
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setRegisterForm({
      ...registerForm,
      [id]: value
    })
  }
  
  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForgotPasswordForm({
      ...forgotPasswordForm,
      [id]: value
    })
  }
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      console.log('Login attempt with:', loginForm)
      
      const response = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      })

      const responseData = await response.json()
      console.log('Server login response:', responseData)
      
      if (response.ok && responseData.success) {
        // Save user data to localStorage for persistence across pages
        const userData = {
          userId: responseData.userId,
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          email: responseData.email
        }
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        setSuccess('Login successful!')
        setLoading(false)
        
        // Get the redirect URL from state, or default to book page
        const { state } = location
        const redirectTo = state && state.from ? state.from : '/book'
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(redirectTo)
        }, 1000)
      } else {
        setError(responseData.message || 'Invalid credentials')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.')
      setLoading(false)
    }
  }
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      // Create API payload matching the backend expectation
      const apiPayload = {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        phoneNumber: registerForm.phoneNumber,
        password: registerForm.password,
        birthdate: registerForm.birthdate,
        address: registerForm.address
      }
      
      console.log('Registration attempt with:', apiPayload)
      
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      })

      const responseData = await response.json()
      console.log('Server response:', responseData)
      
      if (response.ok && responseData.success) {
        setSuccess('Registration successful! You can now login.')
        setLoading(false)
        
        // Switch to login tab after registration
        setTimeout(() => {
          setActiveView('login')
          setLoginForm({
            ...loginForm,
            email: registerForm.email
          })
        }, 1500)
      } else {
        setError(responseData.message || 'Registration failed')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.')
      setLoading(false)
    }
  }
  
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      console.log('Password reset attempt with:', forgotPasswordForm)
      
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordForm)
      })

      const responseData = await response.json()
      console.log('Server response:', responseData)
      
      if (response.ok && responseData.success) {
        setSuccess('Password reset successful! You can now login with your new password.')
        setLoading(false)
        
        // Switch to login tab after password reset
        setTimeout(() => {
          setActiveView('login')
          setLoginForm({
            ...loginForm,
            email: forgotPasswordForm.email
          })
        }, 1500)
      } else {
        setError(responseData.message || 'Password reset failed')
        setLoading(false)
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="top-menu">
        <button className="menu-button" onClick={handleMenuClick}>
          <FaBars />
        </button>
        <div className="menu-items">
          <div className="menu-item" onClick={() => navigate('/')}>Home</div>
          <div className="menu-item" onClick={() => navigate('/book')}>Book a Room</div>
        </div>
      </div>
      
      <div className="home-text">HOME</div>
      
      <div className="auth-content">
        <h1 className="hotel-name">Hotel</h1>
        <h2 className="hotel-subtitle">FJ</h2>
        
        <div className="auth-form-container">
          {error && <div className="auth-message error">{error}</div>}
          {success && <div className="auth-message success">{success}</div>}
          
          {activeView === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="john.doe@gmail.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="**********"
                />
              </div>
              
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
              
              <div className="form-links">
                <span onClick={() => setActiveView('register')}>Register</span>
                <span onClick={() => setActiveView('forgot-password')}>Forgot Password</span>
              </div>
            </form>
          )}

          {activeView === 'register' && (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-row">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName"
                      value={registerForm.firstName}
                      onChange={handleRegisterChange}
                      required
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input 
                      type="email" 
                      id="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                      placeholder="john.doe@gmail.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="birthdate">Birth Date</label>
                    <input 
                      type="date" 
                      id="birthdate"
                      value={registerForm.birthdate}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="**********"
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName"
                      value={registerForm.lastName}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phoneNumber"
                      value={registerForm.phoneNumber}
                      onChange={handleRegisterChange}
                      required
                      placeholder="+41 79 460 46 59"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input 
                      type="text" 
                      id="address"
                      value={registerForm.address}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Birchenhof 21, 8001 Zurich, Switzerland"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      placeholder="**********"
                    />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              
              <div className="form-links">
                <span onClick={() => setActiveView('login')}>Login</span>
              </div>
            </form>
          )}

          {activeView === 'forgot-password' && (
            <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email"
                  value={forgotPasswordForm.email}
                  onChange={handleForgotPasswordChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input 
                  type="password" 
                  id="newPassword"
                  value={forgotPasswordForm.newPassword}
                  onChange={handleForgotPasswordChange}
                  required
                  placeholder="Enter new password"
                />
              </div>
              
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <div className="form-links">
                <span onClick={() => setActiveView('login')}>Back to Login</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
