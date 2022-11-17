import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Col, Row, Container, Nav } from 'react-bootstrap'
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
                  const { title, message, tags, _id, comments } = post
                  const tagsHTML = tags.map(tag => {
                    const tagWithId = { tag: tag, id: uuid() }
                    return <Card.Subtitle key={tagWithId.id} className="tag">#{tagWithId.tag}</Card.Subtitle>
                  })
                  return (
                    <Card key={_id} className="post">
                      <Card.Body>
                        <div className='textBox'>
                          <Card.Title>{title}</Card.Title>
                          <Card.Text>{message}</Card.Text>
                        </div>
                        <div className='infoBox'>
                          <button onClick={handleLike} className="">👍 Likes</button>
                          <Link to={`/${groupId}/${_id}`}><button to="/postId/" className="btn btn-warning">💬 {comments.length} Comments</button></Link>
                          <div className='tagDiv'>
                            {tagsHTML}
                          </div>
                        </div>
                        
                        <Card.Text></Card.Text>
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