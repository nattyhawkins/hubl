import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'
import { unixTimestamp } from '../../helpers/general'
import Comments from './Comments'
import Post from './Post'
import { v4 as uuid } from 'uuid'
import ImageUpload from '../common/ImageUpload'

const Profile = () => {

  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
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
        if (!isAuthenticated()) navigate('/login')
        const { data } = await axios.get(`/api/profile${userAddress}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setProfile(data)
      } catch (err) {
        setError(err.response.data.message)
      }
    }
    getProfile()

  }, [refresh, userAddress])

  //submit profile update
  async function handleSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login')
      if (profileFields.bio.length > 500) throw new Error('Exceeds 500 character limit')
      const { data } = await axios.put('/api/profile', profileFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setProfileFields({ bio: '', image: '' })
      setRefresh(!refresh)
      setToEditProfile(false)
    } catch (err) {
      console.log(err)
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
          <div className='banner mt-4'>
            
            <Container className='bannerContainer wider d-flex align-items-center'>
              <Col className='col-md-3 d-flex justify-content-center pe-4'>
                {toEditProfile ?
                  <ImageUpload
                    groupFields={profileFields}
                    setGroupFields={setProfileFields}
                    imageKey={'image'}
                  />
                  :
                  <div className="profile-pic profile" style={{ backgroundImage: `url(${profile.image})` }} alt="profile"></div>
                }
              </Col>
              <Col className="col-md-9 justify-content-start">
                <button className="btn p-0 post-btn" onClick={() => (editProfile())} >•••</button>
                <h1 className='title'>{profile.username}</h1>
                <div className='bio'>
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
                      {error && <small className='text-warning'>{error}</small>}
                      <br />
                      <button className='uni-btn group-create-btn mt-3'>Submit</button>
                    </form>
                    :
                    <p>{profile.bio}</p>
                  }
                </div>
                
              </Col>
            </Container>
          </div>
          <Row>
            <Container className="profileContainer">
              <Row className='groups-row text-center mt-5' >
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
              <Row className='d-flex  text-center mb-4 flex-wrap h-10'>
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
              <hr />
              <Row className='groups-row mt-5'>
                <h2 className='text-center'>My Posts</h2>
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