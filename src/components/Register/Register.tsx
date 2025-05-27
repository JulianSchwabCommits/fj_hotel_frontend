import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    passwordConfirm: ''
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: handle registration logic here
    if (form.password !== form.passwordConfirm) {
      alert('Passwords do not match!')
      return
    }
    alert('Successfully registered!')
    navigate('/')
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <div className="register-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          name="birthDate"
          placeholder="Birth Date dd/mm/yyyy"
          value={form.birthDate}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address Street"
          value={form.address}
          onChange={handleChange}
          required
        />
        <div className="register-row">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Password Confirmation"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
        <button className="register-btn" type="submit">Register</button>
      </form>
      <button className="back-btn" onClick={() => navigate('/sign-up')}>Back</button>
    </div>
  )
}