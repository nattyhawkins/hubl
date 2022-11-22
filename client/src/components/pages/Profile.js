import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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
              <Row>
                <Container>
                  {profile.myGroups.map(group => {
                    const { name, image, _id: groupId } = group
                    return (
                      <Col md='4' key={groupId} className='group-card' >
                        <Link className='text-decoration-none' to={`${groupId}`}>
                          <Card style={{ backgroundImage: `url(${image})` }}>
                            <div className='group-name'>{name}</div>
                          </Card>
                        </Link>
                      </Col>
                    )

                  })}
                </Container>
              </Row>
            </Container>
          </Row>
        </>
      }

    </main >
  )
}

export default Profile