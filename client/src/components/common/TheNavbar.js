
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'
import skipReset from '../pages/Home.js'
import { useState } from 'react'


const TheNavbar = () => {

  const navigate = useNavigate()

  const [userId, setUserId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
  })


  return (
    <Navbar className='theNavbar'>
      <Container className='navbarContainer'>
        <Navbar.Brand as={Link} to='/' onClick={skipReset} className='logo'>HUBBLE</Navbar.Brand>
        <Nav className='navbar'>
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
          {isAuthenticated() ?
            <>
              <span className='nav-link' onClick={() => handleLogout(navigate)}>Logout</span>
              <Nav.Link as={Link} to={`/profile/${userId}`} >Profile</Nav.Link>
            </>
            :
            <>
              <Nav.Link as={Link} to='/register'>Register</Nav.Link>
              <Nav.Link as={Link} to='/login'>Login</Nav.Link>
            </>
          }
        </Nav>
      </Container>
    </Navbar>
  )
}
export default TheNavbar

