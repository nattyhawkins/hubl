import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'
import { unixTimestamp } from '../../helpers/general'
import Post from '../common/Post'
import ImageUpload from '../common/ImageUpload'
import defaultProfile from '../../../src/assets/profile-penguin.jpg'
import Comments from '../common/Comments'
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
      await axios.put('/api/profile', profileFields, {
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
          <Row className='banner px-md-2'>
            <Container className='px-0 px-sm-2'>
              <div className='bannerContainer wider justify-content-start align-items-center'>
                <div className='d-flex justify-content-center'>
                  {toEditProfile ?
                    <ImageUpload
                      groupFields={profileFields}
                      setGroupFields={setProfileFields}
                      imageKey={'image'}
                    />
                    :
                    <div className="profile-pic profile" style={{ backgroundImage: profile.image ? `url(${profile.image})` : `url(${defaultProfile})` }} alt="profile"></div>
                  }
                </div>
                <div className="px-2 py-md-0 d-flex flex-column align-items-center text-center">
                  <button className="btn p-0 post-btn" onClick={() => (editProfile())} >•••</button>
                  <h1 className='name'>{profile.username}</h1>
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
                  
                </div>
              </div>
            </Container>
          </Row>
          <Row>
            <Container className="profileContainer px-0 px-sm-0">
              <Row className='  text-center mt-3 d-flex flex-column align-items-center' >
                <h2>My Created Groups</h2>
                <Row className=' groups-row d-flex justify-content-center my-3'>
                  {profile.myGroups.map(group => {
                    const { name, image, _id: groupId } = group
                    return (
                      <Col md='3' key={groupId} className='group-card my-2' >
                        <Link className='text-decoration-none' to={`/${groupId}`}>
                          <Card style={{ backgroundImage: `url(${image})` }}>
                            <div className='group-name'>{name}</div>
                          </Card>
                        </Link>
                      </Col>
                    )
                  })}
                  <Col md='3'className='group-card my-2' >
                    <Link className='text-decoration-none' to={'/'}>
                      <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className='group-name'>＋</div>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Row>
              <Row className=' text-center mb-4 h-10 d-flex flex-column align-items-center'>
                <h2>Group Memberships</h2>
                <Row className='d-flex groups-row justify-content-center flex-wrap my-3'>
                  {profile.joinedGroups.map(group => {
                    const { name, image, _id: groupId } = group
                    return (
                      <Col md='3' key={groupId} className='group-card my-2' >
                        <Link className='text-decoration-none' to={`/${groupId}`}>
                          <Card style={{ backgroundImage: `url(${image})` }}>
                            <div className='group-name'>{name}</div>
                          </Card>
                        </Link>
                      </Col>
                    )
                  })}
                  <Col md='3'className='group-card my-2' >
                    <Link className='text-decoration-none' to={'/'}>
                      <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className='group-name'> ＋ </div>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Row>
              <hr />
              <Row className='groups-row mt-5'>
                <h2 className='text-center'>My Posts</h2>
                <Container className="mainContainer"> {profile.myPosts.map(object => {
                  const { groupId, posts } = object
                  return posts.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(post => {
                    const { _id: postId, comments } = post
                    const commentHTML = comments.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(comment => {
                      const { message, _id: commentId, owner } = comment
                      return (
                        <Comments key={commentId} comment={comment} groupId={groupId} postId={postId} setRefresh={setRefresh} refresh={refresh} />
                      )
                    })
                    return (
                      <Post key={postId} postId={postId} commentHTML={commentHTML} post={post} groupId={groupId} setRefresh={setRefresh} refresh={refresh} />
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