import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getToken } from '../../helpers/auth'
import { unixTimestamp } from '../../helpers/general'
import Comments from './Comments'
import Post from './Post'
import { v4 as uuid } from 'uuid'

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
            <Container className="profileContainer">
              <Row className='groups-row text-center'>
                <h2>My Created Groups</h2>
                {profile.myGroups.map(group => {
                  const { name, image, _id: groupId } = group
                  return (
                    <Col md='3' key={groupId} className='group-card' >
                      <Link className='text-decoration-none' to={`${groupId}`}>
                        <Card style={{ backgroundImage: `url(${image})` }}>
                          <div className='group-name'>{name}</div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </Row>
              <Row className='groups-row text-center'>
                <h2>My Posts</h2>
                {/* {profile.myPosts.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(post => {
                  const { tags, _id: postId, comments } = post
                  const tagsHTML = tags.map(tag => {
                    const tagWithId = { tag: tag, id: uuid() }
                    return <Card.Subtitle key={tagWithId.id} className="tag">#{tagWithId.tag}</Card.Subtitle>
                  })
                  const commentHTML = comments.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(comment => {
                    const { message, _id: commentId, owner } = comment
                    return (
                      <Comments key={commentId} comment={comment} groupId={groupId} postId={postId} setRefresh={setRefresh} refresh={refresh} />
                    )
                  })
                  return (
                    <Post key={postId} postId={postId} post={post} commentHTML={commentHTML} tagesHTML={tagsHTML} groupId={groupId} setRefresh={setRefresh} refresh={refresh} />
                  )
                })} */}
              </Row>
            </Container>
          </Row>
        </>
      }

    </main >
  )
}

export default Profile