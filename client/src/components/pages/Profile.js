import axios from 'axios'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { getToken } from '../../helpers/auth'

const Profile = () => {

  const [ profile, setProfile ] = useState(null)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile', { headers: {
          Authorization: `Bearer ${getToken()}`,
        } })
        console.log(data)
        setProfile(data)
      } catch (err) {
        setError(err)
      }
    }
    getProfile()

  }, [])

  return (
    <main className='group-single'>
      {profile && 
      <> 
        <div className='banner'>
          <Container className='bannerContainer'>
            <Col className='col-md-8 title'>
              <h1>{profile.username}</h1>
              
            </Col>
            <Col className="col-md-4 bio justify-end">
              <p>Potential bio editting</p>
            </Col>
          </Container>
        </div>
        <Row>
          <Container className='mainContainer'>
            <Row></Row>
          </Container>
        </Row>
      </>}

    </main >
  )
}

export default Profile