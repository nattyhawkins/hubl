import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'



const GroupSingle = () => {

  const [groups, setGroups] = useState([])
  const [errors, setErrors] = useState([])

  const { groupId } = useParams()


  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/group/${groupId}`)
        console.log('single group data =>', data)
        setGroups(data)
      } catch (err) {
        console.log('yoo', err)
        setErrors(err)
      }
    }
    getGroup()
  }, [groupId])






  return (
    <main className='group-single'>
      <Container className='single-container'>
        <Row className='single-row'>
          <Col className='group-card'>
            <h2>Welcome to {groups.name}</h2>
          </Col>
        </Row>
      </Container>
      <h1>Group single</h1>
    </main>
  )
}
export default GroupSingle