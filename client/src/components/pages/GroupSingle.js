import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container, Button } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import Post from './Post'
import PostForm from '../common/PostForm'
import { getToken, isOwner } from '../../helpers/auth'
import { unixTimestamp } from '../../helpers/general'
import Comments from './Comments'
import GroupEditForm from '../common/GroupEditForm'



const GroupSingle = () => {


  const [group, setGroup] = useState([])
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [toEdit, setToEdit] = useState(false)
  const [postFields, setPostFields] = useState({
    title: '',
    message: '',
    tags: [],
  })
  const [memberStatus, setMemberStatus] = useState(204)

  const [groupFields, setGroupFields] = useState({
    name: '',
    bio: '',
    image: '',
    groupImage: '',
  })
  const { groupId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        setGroup(data)
        console.log(data)
      } catch (err) {
        setError(err)
      }
    }
    getGroup()
  }, [groupId, refresh])

  useEffect(() => {
    console.log(group)
    if (getToken() && group.members && group.members.some(member => isOwner(member.owner))) return setMemberStatus(200)
    setMemberStatus(204)
  }, [group])

  // edit group
  async function editGroup() {
    setToEdit(!toEdit)
    setGroupFields({
      name: group.name,
      bio: group.bio,
      image: group.image,
      groupImage: group.groupImage,
    })
  }


  async function handleGroupSubmit(e) {
    try {
      e.preventDefault()
      await axios.put(`api/groups/${groupId}`, groupFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('edit group success')
      setRefresh(!refresh)
      setToEdit(false)
      setGroupFields({ name: '', bio: '', image: '', groupImage: '' })
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }

  async function deleteGroup(e) {
    try {
      e.preventDefault()
      await axios.delete(`api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('delete grp success')
      setRefresh(!refresh)
      setGroupFields({ name: '', bio: '', image: '', groupImage: '' })
      navigate('/')
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }
  //submit brand new post
  async function handlePostSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login')
      await axios.post(`api/groups/${groupId}/posts`, postFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('post success')
      console.log('whats group', group.owner._id)
      setRefresh(!refresh)
      setPostFields({ title: '', message: '', tags: [] })
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  async function handleJoin(e) {
    try {
      e.preventDefault()
      if (!getToken()) return navigate('/login')
      const { status } = await axios.post(`api/groups/${groupId}/members`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log(status)
      setMemberStatus(status)
      console.log('join success')
      setRefresh(!refresh)
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  return (
    <main className='group-single'>
      {group ?
        <>
          <div className='banner d-flex flex-column align-items-end'>
            {group.owner && isOwner(group.owner._id) &&
              <div className='grp-btn-div'>
                <p
                  title='edit group'
                  className='grp-edit-btn'
                  onClick={editGroup}>
                  ․․․
                </p>
                <p
                  title='WATCH OUT! this deletes the group!'
                  className='grp-delete-btn'
                  onClick={deleteGroup}>
                  🆇
                </p>
              </div>
            }
            <Container className='bannerContainer' style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url(${group.image ? group.image : group.groupImage})` }}>
              {toEdit ?
                <GroupEditForm groupFields={groupFields} setGroupFields={setGroupFields} error={error} setError={setError} handleGroupSubmit={handleGroupSubmit} group={group} />
                :
                <>
                  <Col className='col-md-8 title' >
                    <h5>Welcome to</h5>
                    <h1>{group.name}</h1>
                  </Col>
                  <Col className="col-md-4 align-self-start justify-end d-flex flex-column justify-content-evenly" style={{ height: '250px' }}>
                    <p className='bio'>{group.bio}</p>
                    <div className='d-flex align-items-center justify-content-between' style={{ width: '210px' }}>
                      {group && memberStatus === 204 ? 
                        <Button variant="warning" onClick={handleJoin}>Join Group</Button> 
                        : 
                        <Button variant="outline-warning" onClick={handleJoin}>Leave Group</Button>
                      }
                      {group.members && (group.members.length === 1 ? <p style={{ margin: '0 0 0 10px' }} >{group.members.length} member</p> : <p style={{ margin: '0 0 0 10px' }}>{group.members.length} members</p>)}
                    </div>
                  </Col>
                </>
              }
            </Container>
          </div>
          <Row>
            <Container className='mainContainer'>
              <PostForm postFields={postFields} setPostFields={setPostFields} error={error} setError={setError} handlePostSubmit={handlePostSubmit} />
              {group.posts && group.posts.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(post => {
                const { tags, _id: postId, comments } = post
                const tagsHTML = tags.map(tag => {
                  const tagWithId = { tag: tag, id: uuid() }
                  return <Card.Subtitle key={tagWithId.id} className="tag">#{tagWithId.tag}</Card.Subtitle>
                })
                const commentHTML = comments.sort((a, b) => (unixTimestamp(a.createdAt) > unixTimestamp(b.createdAt) ? -1 : 1)).map(comment => {
                  const { _id: commentId } = comment
                  return (
                    <Comments key={commentId} comment={comment} groupId={groupId} postId={postId} setRefresh={setRefresh} refresh={refresh} />
                  )
                })
                return (
                  <Post key={postId} postId={postId} post={post} commentHTML={commentHTML} tagesHTML={tagsHTML} groupId={groupId} setRefresh={setRefresh} refresh={refresh} />
                )
              })}
            </Container>
          </Row>
        </>
        : <h1>{error.message}</h1>
      }
    </main >
  )
}
export default GroupSingle