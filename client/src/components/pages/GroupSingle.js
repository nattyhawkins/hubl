import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostIndex from './PostIndex.js'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'



const GroupSingle = () => {

  const [group, setGroup] = useState([])
  const [errors, setErrors] = useState(false)

  const { groupId } = useParams()


  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        console.log('single group data =>', data)
        setGroup(data)
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
          {group ?
            <Col className='group-card'>
              <h2>Welcome to {group.name}</h2>
              <p>{group.bio}</p>
              <div>
                {group.posts && group.posts.map(post => {
                  const { title, message, _id } = post
                  {
                    const commentsFromMap = post.comments.map(comment => {
                      const { message, _id } = comment
                      return (
                        <p key={_id}>{message}</p>
                      )
                    })
                    return (
                      <div key={_id}>
                        <h3>{title}</h3>
                        <p>{message}</p>
                        <div>{commentsFromMap}</div>
                      </div>
                    )
                  }
                })
                }
              </div>
            </Col>
            : <h2>error</h2>}
        </Row>
      </Container>
      <h1>Group single</h1>
    </main >
  )
}
export default GroupSingle