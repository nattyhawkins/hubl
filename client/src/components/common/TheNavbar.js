
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { isAuthenticated, handleLogout } from '../../helpers/auth'


const TheNavbar = () => {

  const navigate = useNavigate()

  return (
    <Navbar className='theNavbar'>
      <Container className='navbarContainer'>
        <Navbar.Brand as={Link} to='/' className='logo'>HUBBLE</Navbar.Brand>
        <Nav className='navbar'>
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
          {console.log(isAuthenticated())}
          {isAuthenticated() ?
            <>
              <span className='nav-link' onClick={() => handleLogout(navigate)}>Logout</span>
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

