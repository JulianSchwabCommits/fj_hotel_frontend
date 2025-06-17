import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import './Auth.css'

type AuthView = 'login' | 'register'

interface RegisterFormState {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  city: string
  country: string
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
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: 'Swiss',
    password: '',
    confirmPassword: ''
  })

  // Form submission states
  const [loading, setLoading] = useState(false)
  // Remove unused errors state
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
      // In a real app, this would be an API call to your backend
      console.log('Login attempt with:', loginForm)
      
      // Simulate API call
      setTimeout(() => {
        // Mock successful login
        const user = {
          email: loginForm.email,
          firstName: 'Test',
          lastName: 'User'
        }
        
        // Save user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        setSuccess('Login successful!')
        setLoading(false)
        
        // Get the redirect URL from state, or default to book page
        const { state } = location
        const redirectTo = state && state.from ? state.from : '/book'
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(redirectTo)
        }, 1000)
      }, 1000)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
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
      // In a real app, this would be an API call to your backend
      console.log('Registration attempt with:', registerForm)
      
      // Simulate API call
      setTimeout(() => {
        // Mock successful registration
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
      }, 1000)
    } catch (err) {
      setError('Registration failed. Please try again.')
      setLoading(false)
    }
  }
  
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // In a real app, this would be an API call to your backend
      console.log('Password reset attempt with:', forgotPasswordForm)
      
      // Simulate API call
      setTimeout(() => {
        // Mock successful password reset
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
      }, 1000)
    } catch (err) {
      setError('Password reset failed. Please try again.')
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
              <div className="form-group">
                <label htmlFor="fullName">Fullname</label>
                <input 
                  type="text" 
                  id="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  required
                  placeholder="John Doe"
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
                <label htmlFor="phoneNumber">Phonenumber</label>
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
                  placeholder="Birchenhof 21"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city"
                    value={registerForm.city}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Zürich"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select 
                    id="country"
                    value={registerForm.country}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="Swiss">Swiss</option>
                    <option value="Germany">Germany</option>
                    <option value="Austria">Austria</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                  </select>
                </div>
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
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Password Bestätigen</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  placeholder="**********"
                />
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
