import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../../helpers/auth.js'

const Login = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState(false)

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/login', formFields)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      setError(err.response.data.message)

    }
  }


  return (
    <main className='auth-pages'>
      <h1>Welcome Back!</h1>
      <p>Don&apos;t have an account? <span className='login-here' onClick={() => (navigate('/register'))}>Register here.</span></p>
      <div className='login form-container'>
        <form onSubmit={handleSubmit} className='form'>
          <input
            type='text'
            name='username'
            placeholder='Username *'
            onChange={handleChange}
            value={formFields.username}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password *'
            onChange={handleChange}
            value={formFields.password}
            required
          />
          {error && <small className='text-warning'>{error}</small>}
          <button className='uni-btn-primary mt-5 mb-4'>Log in</button>
        </form>
      </div>
    </main>
  )
}
export default Login
