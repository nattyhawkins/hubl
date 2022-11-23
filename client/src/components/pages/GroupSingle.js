import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container, Collapse, Button } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import Post from './Post'
import PostForm from '../common/PostForm'
import { getToken } from '../../helpers/auth'
import moment from 'moment'
import { unixTimestamp } from '../../helpers/general'
import { isOwner } from '../../helpers/auth'
import Comments from './Comments'



const GroupSingle = () => {

  const [group, setGroup] = useState([])
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [postFields, setPostFields] = useState({
    title: '',
    message: '',
    tags: [],
  })
  const [ memberStatus, setMemberStatus ] = useState(() => {
    if (getToken() && group.members && group.members.some(member => isOwner(member.owner))) return 202
    return 204
  })


  // const [ tag, setTag ] = useState('')

  const { groupId } = useParams()


  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        console.log(data)
        setGroup(data)
      } catch (err) {
        setError(err)
      }
    }
    getGroup()
    // document.getElementById('tagInput').addEventListener('keypress', function (e) {
    //   if (e.key === 'Enter') {
    //     handleTagSubmit()
    //   }
    // })
  }, [groupId, refresh])


  // function handleTagChange(e){
  //   setTag(e.target.value)
  // }

  // function handleTagSubmit(){
  //   console.log(tag)
  //   const tagElement = document.createElement('p')

  //   tagElement.innerHTML = tag
  //   document.getElementById('tagDisplay').appendChild(tagElement)
  //   const newTags = postFields.tags.push(tag)
  //   setPostFields({ ...postFields, tags: newTags })
  //   setTag('')

  // }


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
      const { status } = await axios.post(`api/groups/${groupId}/members`, { }, { headers: {
        Authorization: `Bearer ${getToken()}`,
      } })
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
          <div className='banner'>
            <Container className='bannerContainer'>
              <Col className='col-md-8 title'>
                <h5>Welcome to</h5>
                <h1>{group.name}</h1>
              </Col>
              <Col className="col-md-4 bio justify-end">
                <p>{group.bio}</p>
                {group.members && (group.members.length === 1 ? <p>{group.members.length} member</p> : <p>{group.members.length} members</p>)}
                {memberStatus === 204 ? <Button onClick={handleJoin}>Join Group</Button> : <Button onClick={handleJoin}>Leave Group</Button>
                }
                
              </Col>
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
                  const { message, _id: commentId, owner } = comment
                  return (
                    <Comments key={commentId} comment={comment} groupId={groupId} postId={postId} setRefresh={setRefresh} refresh={refresh} />
                  )
                })
                return (
                  <Post key={postId} postId={postId} post={post} commentHTML={commentHTML} tagesHTML={tagsHTML} groupId={groupId} setRefresh={setRefresh} refresh={refresh}/>
                )
              })}
            </Container>
          </Row>
        </>
        : <h1>{ error.message }</h1>
      }

    </main >
  )
}
export default GroupSingle