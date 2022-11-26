import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {


  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const [error, setError] = useState(false)





  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/register', formFields)
      navigate('/login')
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  const handleChange = (e) => {
    const updatedFormFields = {
      ...formFields,
      [e.target.name]: e.target.value,
    }
    setFormFields(updatedFormFields)
    if (error) setError('')
  }




  return (
    <main className='auth-pages'>
      <h1>Register</h1>
      <p>Already have an account? <span className='login-here' onClick={() => (navigate('/login'))}>Login here.</span></p>
      <div className='register form-container'>
        <form onSubmit={handleSubmit} className='form'>
          <input
            type='text'
            name='username'
            placeholder='Username *'
            autoComplete='off'
            onChange={handleChange}
            value={formFields.username}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email *'
            onChange={handleChange}
            value={formFields.email}
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
          <input
            type='password'
            name='passwordConfirmation'
            placeholder='Confirm Password *'
            onChange={handleChange}
            value={formFields.passwordConfirmation}
            required
          />
          {error && <small className='text-warning'>{error}</small>}
          <button className='uni-btn-primary mt-5 mb-4'>Register</button>
        </form>
        <div className='text'>
        </div>
        <p className='terms'><span>By signing up, you agree to our</span> Terms &amp; Privacy Policy.</p>
      </div>
    </main>
  )
}
export default Register