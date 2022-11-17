import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'



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
        {group ?
          <>
            <Row className='banner'>
              <Container className='bannerContainer'>
                <Col md="6" lg="4" className='title'>
                  <h1>Welcome to {group.name}</h1>
                </Col>
                <Col md="6" lg="4" offset="3" className="bio justify-end">
                  <p>{group.bio}</p>
                </Col>
              </Container>
            </Row>
            <Row>
              <Container className='mainContainer'>
                {group.posts && group.posts.map(post => {
                  const { title, message, tags, _id } = post
                  // const tagsHTML = tags.map(tag => {
                  //   return <Card.Subtitle key="">{tag}</Card.Subtitle>
                  // })
                  return (
                    <Card key={_id} className="post">
                      <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <Card.Text>{message}</Card.Text>
                        {/* <div>
                          {tagsHTML}
                        </div> */}
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