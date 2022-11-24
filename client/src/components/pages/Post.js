import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, Card, Collapse } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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

  //time since posting
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
      await axios.post(`/api/groups/${groupId}/posts/${postId}/comments`, commentField, {
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
      await axios.put(`/api/groups/${groupId}/posts/${postId}`, postFields, {
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
      await axios.delete(`/api/groups/${groupId}/posts/${postId}`, {
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
      const { status } = await axios.post(`/api/groups/${groupId}/posts/${postId}/likes`, {}, {
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
    <Card key={postId} className='post'>
      <Card.Body>
        {/* If owner show edit & delete */}
        {isOwner(post.owner._id) &&
          <div className='d-flex justify-content-end'>
            <p className='post-btn' onClick={editPost}>•••</p>
            <p style={{ fontSize: '20px' }} className='post-btn' onClick={deletePost}>ⓧ</p>
          </div>
        }
        {toEdit ?
          <PostForm postFields={postFields} setPostFields={setPostFields} error={error} setError={setError} handlePostSubmit={handlePostSubmit} />
          :
          <div className="textBox">
            <Card.Title><Link to={`/profile/${post.owner._id}`} className="username">@{post.owner.username}</Link>{post.title}</Card.Title>
            <Card.Text>{post.message}</Card.Text>
            <Card.Text><small>{timeElapsed}</small></Card.Text>
          </div>
        }
        <div className='infoBox'>
          <div className='d-flex align-items-center' style={{ height: '50px' }}>
            {/* comment box */}
            <div className="d-flex align-items-center justify-content-between" style={{ width: '260px' }} onClick={() => setOpen(!open)} aria-controls={postId} aria-expanded={open}>
              <p className='like-btn' >💬</p>
              <div style={{ width: '210px' }}>
                <div>
                  {post.comments.length === 0 ? <> Be the first to comment</>
                    :
                    post.comments.length === 1 ? <> 1 Comment</>
                      :
                      <>{post.comments.length} Comments</>
                  }
                </div>
              </div>
            </div>
            {/* like box */}
            <div className="d-flex align-items-center justify-content-between" style={{ width: '230px' }} onClick={handlePostLike}>
              {likeStatus === 204 ?
                <p className='like-btn' >👍</p>
                :
                <p className='like-btn liked'>❤️</p>
              }
              <div style={{ width: '180px' }}>
                <div >
                  {post.likes.length === 0 ? <> Be the first to like</>
                    :
                    post.likes.length === 1 ? <> 1 Like</>
                      :
                      <>{post.likes.length} Likes</>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <a id={postId} ></a> */}
        <Collapse in={open}>
          <div id={postId}>
            <CommentForm commentField={commentField} setCommentField={setCommentField} error={error} setError={setError} handleCommentSubmit={handleCommentSubmit} />
            {commentHTML}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Post