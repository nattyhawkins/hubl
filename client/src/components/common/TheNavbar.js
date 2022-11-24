
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'
import skipReset from '../pages/Home.js'
import { useEffect, useState } from 'react'
import logo from '../../../src/assets/hubl-logo.jpg'


const TheNavbar = () => {

  const navigate = useNavigate()

  return (
    <Navbar className='theNavbar'>
      <Container className='navbarContainer'>
        <Navbar.Brand as={Link} to='/' onClick={skipReset}>
          <img className="logo" src={logo}/>
        </Navbar.Brand>
        <Nav className='navbar'>
          {/* <Nav.Link as={Link} to='/'>Home</Nav.Link> */}
          {isAuthenticated() ?
            <>
              <Link className='nav-link' onClick={() => handleLogout(navigate)}>Logout</Link>
              <Nav.Link as={Link} to='/profile' >Profile</Nav.Link>
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

