
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'


const TheNavbar = () => {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand as={Link} to='/' className='intro-navbar'>
          <main className='theNavbar'>
            <h1>LOGO</h1>
          </main>
        </Navbar.Brand>
        <Nav className='justify-content-end'>
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
          <Nav.Link as={Link} to='/groups'>Groups</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
export default TheNavbar