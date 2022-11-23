import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import { getToken, isOwner } from '../../helpers/auth'
import { getTimeElapsed } from '../../helpers/general'
import PostForm from '../common/PostForm'
import CommentForm from './CommentForm'



const Post = ({ postId, post, commentHTML, tagsHTML, groupId, setRefresh, refresh }) => {

  const [open, setOpen] = useState(false)
  const [likeStatus, setLikeStatus] = useState(() => {
    if (getToken() && post.likes.some(like => isOwner(like.owner))) return 202
    return 204
  })
  const [timeElapsed, setTimeElapsed] = useState(getTimeElapsed(post.createdAt))
  const [toEdit, setToEdit] = useState(false)
  const [error, setError] = useState(false)
  const [postFields, setPostFields] = useState({
    title: '',
    message: '',
    tags: [],
  })
  const [commentField, setCommentField] = useState({
    message: '',
  })

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeElapsed(getTimeElapsed(post.createdAt))
    }, 1000)
    return () => {
      clearInterval(tick)
    }
  }, [])

  async function handleCommentSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login')
      await axios.post(`api/groups/${groupId}/posts/${postId}/comments`, commentField, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('post comment success')
      setRefresh(!refresh)
      setCommentField({ message: '' })
      setOpen(true)
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  //Updating Post
  async function editPost(e) {
    setToEdit(!toEdit)
    setPostFields({
      title: post.title,
      message: post.message,
      tags: post.tags,
    })
  }
  //submit edit post
  async function handlePostSubmit(e) {
    try {
      e.preventDefault()
      await axios.put(`api/groups/${groupId}/posts/${postId}`, postFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
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
  async function deletePost(e) {
    try {
      e.preventDefault()
      await axios.delete(`api/groups/${groupId}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('delete post success')
      setRefresh(!refresh)
      setPostFields({ title: '', message: '', tags: [] })
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }

  async function handlePostLike(e) {
    try {
      if (!getToken()) throw new Error('Please login')
      e.preventDefault()
      const { status } = await axios.post(`api/groups/${groupId}/posts/${postId}/likes`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setLikeStatus(status)
      console.log('like success')
      setRefresh(!refresh)
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  return (
    <Card key={postId} className="post">
      <Card.Body>
        {/* If owner show edit & delete */}
        {isOwner(post.owner._id) &&
          <div className="d-flex justify-content-end">
            <button className="me-2 subtle" onClick={editPost}>Edit</button>
            <button className="subtle" onClick={deletePost}>Delete</button>
          </div>
        }
        {toEdit ?
          <PostForm postFields={postFields} setPostFields={setPostFields} error={error} setError={setError} handlePostSubmit={handlePostSubmit} />
          :
          <div className="textBox">
            <Card.Title><span className="username">@{post.owner.username}</span> {post.title}</Card.Title>
            <Card.Text>{post.message}</Card.Text>
            <Card.Text>{timeElapsed}</Card.Text>
          </div>
        }
        <div className="infoBox">
          {likeStatus === 204 ?
            <button className="likeBtn" onClick={handlePostLike}>
              {post.likes.length === 0 ? <>👍 Be the first to like</>
                :
                post.likes.length === 1 ? <>👍 1 Like</>
                  :
                  <>👍 {post.likes.length} Likes</>
              }</button>
            :
            <button className="likeBtn liked" onClick={handlePostLike}>
              {post.likes.length === 0 ? <>👍 Be the first to like</>
                :
                post.likes.length === 1 ? <>👍 1 Like</>
                  :
                  <>👍 {post.likes.length} Likes</>
              }</button>
          }
          <button className="btn" onClick={() => setOpen(!open)} aria-controls={postId} aria-expanded={open} >💬 {post.comments.length} Comments</button>
          <div className="tagDiv">
            {tagsHTML}
          </div>
        </div>
        <CommentForm commentField={commentField} setCommentField={setCommentField} error={error} setError={setError} handleCommentSubmit={handleCommentSubmit} />
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