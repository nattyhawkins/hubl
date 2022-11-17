import axios from 'axios'
import { useEffect, useState } from 'react'

const Register = () => {


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
      await axios.post('/api/register')

    } catch (err) {
      setError(err.response.data.message)
    }
  }






  return (
    <>
      <div className='register form-container'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className='form' action='#' method='post'>
          <input type='text' placeholder='Username' autoComplete='off' onChange={(e) => setUser(e.target.value)} required />
          <input type='email' placeholder='Email' onChange={(e) => setPassword(e.target.value)} required />
          <input type='password' placeholder='Password' required />
          <input type='password' placeholder='Confirm Password' required />
        </form>
        <button id='signup-btn'>Register</button>
        <div className='text'>
          <p><span>By signing up, you agree to our</span> Terms &amp; Privacy Policy.</p>
        </div>
      </div>
    </>
  )
}
export default Register