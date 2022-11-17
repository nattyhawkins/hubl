const Login = () => {
  return (
    <>
      <div className='login form-container'>
        <h1>Welcome Back!</h1>
        <div className=' flex-center'></div>
        <form className='form' action='#' method='post'>
          <input type='email' placeholder='Username' required />
          <input type='password' placeholder='Password' required />
        </form>
        <button id='signup-btn'>Log in</button>
      </div>
    </>
  )
}
export default Login
