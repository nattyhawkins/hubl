import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Col, Row, Container, Nav, Collapse } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'



const GroupSingle = () => {

  const [group, setGroup] = useState([])
  const [error, setError] = useState(false)

  const { groupId } = useParams()


  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        console.log('single group data =>', data)
        setGroup(data)
      } catch (err) {
        console.log('yoo', err)
        setError(err)
      }
    }
    getGroup()
  }, [groupId])

  function handleLike(){

  }

  return (
    <main className='group-single'>
      <Container className='single-container'>
        {group ?
          <>
            <Row className='banner'>
              <Container className='bannerContainer'>
                <Col md="6" lg="4" className='title'>
                  <h5>Welcome to</h5>
                  <h1>{group.name}</h1>
                </Col>
                <Col md="6" lg="4" offset="3" className="bio justify-end">
                  <p>{group.bio}</p>
                </Col>
              </Container>
            </Row>
            <Row>
              <Container className='mainContainer'>
                {group.posts && group.posts.map(post => {
                  const { title, message, tags, _id, comments, owner } = post
                  const tagsHTML = tags.map(tag => {
                    const tagWithId = { tag: tag, id: uuid() }
                    return <Card.Subtitle key={tagWithId.id} className="tag">#{tagWithId.tag}</Card.Subtitle>
                  })
                  const commentHTML = comments.map(comment => {
                    const { message, _id, owner } = comment
                    return (
                      <Card key={_id}>
                        <Card.Title className="userName">@{owner.username}</Card.Title>
                        <Card.Text>{message}</Card.Text>
                      </Card>
                    )
                  })
                  return (
                    <Card key={_id} className="post">
                      <Card.Body>
                        <div className='textBox'>
                          <Card.Title><span className='username'>@{owner.username}</span> {title}</Card.Title>
                          <Card.Text>{message}</Card.Text>
                        </div>
                        <div className='infoBox'>
                          <button onClick={handleLike} >👍 Likes</button>
                          <button className="btn btn-warning" type='button' data-toggle='collapse' data-target='#comments' aria-expanded='false' aria-controls='comments' >💬 {comments.length} Comments</button>
                          <div className='tagDiv'>
                            {tagsHTML}
                          </div>
                        </div>
                        <Collapse id='comments'>
                          <>
                            {commentHTML}
                          </>
                        </Collapse>
                      </Card.Body>
                    </Card>
                  )
                })}
              </Container>
            </Row>
          </>
          : <h2>error</h2>
        }
      </Container>
    </main >
  )
}
export default GroupSingle