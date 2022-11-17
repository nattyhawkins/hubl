import { useEffect, useState } from 'react'

const Register = () => {


  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState(false)













  return (
    <>
      <div className='register form-container'>
        <h1>Register</h1>
        <form className='form' action="#" method="post">
          <input type="email" placeholder="Username" required />
          <input type="text" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
        </form>
        <button id="signup-btn">Register</button>
        <div className='text'>
          <p><span>By signing up, you agree to our</span> Terms &amp; Privacy Policy.</p>
        </div>
      </div>
    </>
  )
}
export default Register