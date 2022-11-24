import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getToken } from '../../helpers/auth'
import { unixTimestamp } from '../../helpers/general'
import Comments from './Comments'
import Post from './Post'
import { v4 as uuid } from 'uuid'
import ImageUpload from '../common/ImageUpload'

const Profile = () => {

  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const { userId } = useParams()
  const [userAddress, setUserAddress] = useState(() => {
    if (userId) return `/${userId}`
    return ''
  })
  const [toEditProfile, setToEditProfile] = useState(false)
  const [profileFields, setProfileFields] = useState({
    bio: '',
    image: '',
  })


  useEffect(() => {
    setUserAddress(() => {
      if (userId) return `/${userId}`
      return ''
    })
  }, [userId])

  useEffect(() => {
    const getProfile = async () => {
      try {
        console.log(userAddress)
        console.log(userId)
        const { data } = await axios.get(`/api/profile${userAddress}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log(data)
        setProfile(data)
      } catch (err) {
        setError(err)
      }
    }
    getProfile()

  }, [refresh, userAddress])

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login')
      const { data } = await axios.patch('/api/profile', profileFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('profile updated!!', data)
      setProfileFields({ bio: '', image: '' })
      setRefresh(!refresh)
      setToEditProfile(false)
    } catch (err) {
      console.log('EDIT FAIL ->', err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  function handleChange(e) {
    setProfileFields({ ...profileFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }
  async function editProfile() {
    setToEditProfile(!toEditProfile)
    setProfileFields({
      bio: profile.bio,
      image: profile.image,
    })
  }

  return (
    <main className='group-single profile'>
      {profile &&
        <>
          <div className='banner'>
            <Container className='bannerContainer'>
              <Col >
                {toEditProfile ?
                  <ImageUpload
                    groupFields={profileFields}
                    setGroupFields={setProfileFields}
                    imageKey={'image'}
                  />
                  :
                  <div className="profile-pic profile" style={{ backgroundImage: `url(${profile.image})` }} alt="profile"></div>
                }
                <div className='col-md-8 title d-flex align-items-end'>
                  <h1>{profile.username}</h1>
                  <button title='edit profile' className="btn" style={{ color: 'white' }} onClick={() => (editProfile())} >•••</button>
                </div>
                {/* <img  src='https://i.pinimg.com/originals/30/10/27/301027a5dc725be9db489aa498d3eddf.jpg' alt="profile"/> */}
              </Col>
              <Col className="col-md-4 bio justify-end align-self-start">
                {toEditProfile ?
                  <form onSubmit={handleSubmit}>
                    <input
                      className='text-area w-100'
                      type='text'
                      name='bio'
                      onChange={handleChange}
                      value={profileFields.bio}
                      placeholder='Don&apos;t be shy... Introduce yourself!'
                      required />
                    {error && <small className='text-danger'>{error}</small>}
                    <br />
                    <button className='uni-btn group-create-btn'>Submit</button>
                  </form>
                  :
                  <p>{profile.bio}</p>
                }
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
                      <Link className='text-decoration-none' to={`/${groupId}`}>
                        <Card style={{ backgroundImage: `url(${image})` }}>
                          <div className='group-name'>{name}</div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </Row>
              <Row className='groups-row text-center'>
                <h2>Group Memberships</h2>
                {profile.joinedGroups.map(group => {
                  const { name, image, _id: groupId } = group
                  return (
                    <Col md='3' key={groupId} className='group-card' >
                      <Link className='text-decoration-none' to={`/${groupId}`}>
                        <Card style={{ backgroundImage: `url(${image})` }}>
                          <div className='group-name'>{name}</div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </Row>
              <Row className='groups-row'>
                <h2>My Posts</h2>
                <Container className="mainContainer"> {profile.myPosts.map(object => {
                  const { groupId, posts } = object
                  return posts.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(post => {
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
                      <Post key={postId} postId={postId} commentHTML={commentHTML} tagesHTML={tagsHTML} post={post} groupId={groupId} setRefresh={setRefresh} refresh={refresh} />
                    )
                  })
                })}</Container>
              </Row>
            </Container>
          </Row>
        </>
      }
    </main >
  )
}

export default Profile