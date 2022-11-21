import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../../helpers/auth.js'


import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'



const Login = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/login', formFields)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err.response.data.message)

    }
  }


  return (
    <main>
      <Container className='login form-container'>
        <h1>Welcome Back!</h1>
        <div className='flex-center'></div>
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
          <button>Log in</button>
        </form>
        {error && <small className='text-danger'>{error}</small>}
      </Container>
    </main>
  )
}
export default Login