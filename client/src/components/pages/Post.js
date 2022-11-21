import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getToken, isOwner } from '../../helpers/auth'
import PostForm from '../common/PostForm'
import moment from 'moment'



const Post = ({ postId, post, commentHTML, tagsHTML, groupId, setRefresh, refresh }) => {

  const [ open, setOpen ] = useState(false)
  const [ timeElapsed, setTimeElapsed ] = useState(getTimeElapsed())
  const [ toEdit, setToEdit ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ postFields , setPostFields ] = useState({
    title: '',
    message: '',
    tags: [],
  })
  const [ comment , setComment ] = useState({
    message: '',
  })
  
  useEffect(() => {
    const tick = setInterval(() => {
      setTimeElapsed(getTimeElapsed())
    }, 1000)
    return () => {
      clearInterval(tick)
    }
  }, [])
  useEffect(() => {
    console.log(timeElapsed)
  }, [timeElapsed])

  function getTimeElapsed() {
    const now = new Date()
    const mins = Math.round((moment(now).format('X') - moment(post.createdAt).format('X')) / 60)
    const hours = Math.round(mins / 60)
    const days = Math.round(hours / 24)
    if (mins < 1) return 'Just now'
    if (mins < 2) return '1 minute ago'
    if (mins < 60) return mins + ' minutes ago'
    if (mins <= 90) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    if (hours < 48) return moment(post.createdAt).format('[Yesterday at] LT')
    if (days < 7) return moment(post.createdAt).format('ddd LT')
    if (days < 360) return moment(post.createdAt).format('MMM D LT')
    else return moment(post.createdAt).format('ll LT')
  }
  //Comments
  function handleChange(e){
    setComment({ ...comment, [e.target.name]: e.target.value })
    if (error) setError('')
  }
  async function handleCommentSubmit(e){
    try {
      e.preventDefault()
      await axios.post(`api/groups/${groupId}/posts/${postId}/comments`, comment, { headers: {
        Authorization: `Bearer ${getToken()}`,
      } })
      console.log('post comment success')
      setRefresh(!refresh)
      setComment({ message: '' })
      setOpen(true)
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }

  //Updating Post
  async function editPost(e){
    setToEdit(!toEdit)
    setPostFields({
      title: post.title,
      message: post.message,
      tags: post.tags,
    })
  }
  //submit edit post
  async function handlePostSubmit(e){
    try {
      e.preventDefault()
      await axios.put(`api/groups/${groupId}/posts/${postId}`, postFields, { headers: {
        Authorization: `Bearer ${getToken()}`,
      } })
      console.log('Edit post success')
      setRefresh(!refresh)
      setToEdit(false)
      setPostFields({ title: '', message: '', tags: [] })
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }

  //delete post
  async function deletePost(e){
    try {
      e.preventDefault()
      await axios.delete(`api/groups/${groupId}/posts/${postId}`, { headers: {
        Authorization: `Bearer ${getToken()}`,
      } })
      console.log('delete post success')
      setRefresh(!refresh)
      setPostFields({ title: '', message: '', tags: [] })
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }
  

  return (
    <Card key={postId} className="post">
      <Card.Body>
        {/* If owner show edit & delete */}
        {isOwner(post.owner._id) &&
          <div className="d-flex justify-content-end">
            <button className="me-2" onClick={editPost}>Edit</button>
            <button onClick={deletePost}>Delete</button>
          </div>
        }
        {toEdit ? 
          <PostForm postFields={postFields} setPostFields={setPostFields} error={error} setError={setError} handlePostSubmit={handlePostSubmit}/>
          :  
          <div className="textBox">
            <Card.Title><span className="username">@{post.owner.username}</span> {post.title}</Card.Title>
            <Card.Text>{post.message}</Card.Text>
            <Card.Text>{timeElapsed}</Card.Text>
          </div>
        }
        <div className="infoBox">
          <button >👍 Likes</button>
          <button className="btn" onClick={() => setOpen(!open)} aria-controls={postId} aria-expanded={open} >💬 {post.comments.length} Comments</button>
          <div className="tagDiv">
            {tagsHTML}
          </div>
        </div>
        <form onSubmit={handleCommentSubmit}>
          <input type="text" name="message" onChange={handleChange} value={comment.message} placeholder="Comment..." required/>
          {error && <small className='text-danger'>{error}</small>}
          <button className="btn" >Send</button>
        </form>
        <Collapse in={open}>
          <div id={postId}>
            {commentHTML}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Post