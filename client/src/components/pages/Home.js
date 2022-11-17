import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'




const GroupIndex = () => {


  const [groups, setGroups] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        setGroups(data)
        console.log('group index data =>', data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])




  return (
    <main className='group-index'>
      <Container className='groups-container'>
        <Row>
          {groups.map(group => {
            const { name, _id, bio } = group
            return (
              <Col key={_id} sm='6' md='3' className='group-card mb-4 text-decoration-none'>
                <Card className='text-decoration-none'>
                  <Link className='text-decoration-none' to={`${_id}`}>
                    <h2 className='text-decoration-none'>{name}</h2>
                  </Link>
                  <div className='card-image'></div>
                  <Card.Body>
                    <p>{bio}</p>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>
      <h1>group index</h1>
    </main>
  )
}
export default GroupIndex