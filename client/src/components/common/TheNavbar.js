
import { Link } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'


const TheNavbar = () => {
  return (
    <Navbar className='theNavbar'>
      <Container className='navbarContainer'>
        <Navbar.Brand as={Link} to='/' className='logo'>Hubble</Navbar.Brand>
        <Nav className='navbar'>
          <Nav.Link as={Link} to='/register'>Register</Nav.Link>
          <Nav.Link as={Link} to='/login'>Login</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
export default TheNavbar