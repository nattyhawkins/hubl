import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getToken, isOwner } from '../../helpers/auth'
import { getTimeElapsed } from '../../helpers/general'
import PostForm from './PostForm'
import CommentForm from './CommentForm'



const Post = ({ postId, post, commentHTML, groupId, setRefresh, refresh }) => {

  const [open, setOpen] = useState(false)
  const [likeStatus, setLikeStatus] = useState(() => {
    if (getToken() && post.likes.some(like => isOwner(like.owner))) return 202
    return 204
  })
  const [timeElapsed, setTimeElapsed] = useState(getTimeElapsed(post.createdAt))
  const [toEdit, setToEdit] = useState(false)
  const [postError, setPostError] = useState(false)
  const [error, setError] = useState(false)
  const [commentError, setCommentError] = useState(false)
  const [postFields, setPostFields] = useState({
    title: '',
    message: '',
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
      if (commentField.message.length > 500) throw new Error('500 Character limit exceeded')
      if (!getToken()) throw new Error('Please login')
      await axios.post(`/api/groups/${groupId}/posts/${postId}/comments`, commentField, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(!refresh)
      setCommentField({ message: '' })
      setOpen(true)
    } catch (err) {
      setCommentError(err.message ? err.message : err.response.data.message)
    }
  }

  //Updating Post
  async function editPost(e) {
    setToEdit(!toEdit)
    setPostFields({
      title: post.title,
      message: post.message,
    })
  }
  //submit edit post
  async function handlePostSubmit(e) {
    try {
      e.preventDefault()
      if (postFields.title.length > 100 || postFields.message.length > 250) throw new Error('Character limit exceeded')
      await axios.put(`/api/groups/${groupId}/posts/${postId}`, postFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(!refresh)
      setToEdit(false)
      setPostFields({ title: '', message: '' })
    } catch (err) {
      setPostError(err.message ? err.message : err.response.data.message)
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
      setRefresh(!refresh)
      setPostFields({ title: '', message: '' })
    } catch (err) {
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
      setRefresh(!refresh)
    } catch (err) {
      setError( err.response.data.message)
    }
  }


  return (
    <Card key={postId} className='post'>
      <hr />
      <Card.Body className='pt-2 pb-0 px-0 px-sm-2 px-lg-4'>
        {/* If owner show edit & delete */}
        <div className='d-flex justify-content-between mb-2 mb-sm-3'>
          <div className='d-flex align-items-center d-sm-block'>
            <Link to={`/profile/${post.owner._id}`} className="d-sm-none flex-column align-items-center">
              <div className="profile-pic icon small me-2" style={{ backgroundImage: `url(${post.owner.image})` }} alt="profile"></div>
            </Link>
            <div className='d-sm-flex align-items-center justify-content-end'>
              <Link to={`/profile/${post.owner._id}`}>
                <Card.Title className="username mb-0" >@{post.owner.username}</Card.Title>
              </Link>
              <small>{timeElapsed}</small>
            </div>
          </div>
          <div className='d-flex justify-content-end' style={{ height: '20px' }}>
            {isOwner(post.owner._id) &&
              <>
                <p title='edit post' className='post-btn' onClick={editPost}>•••</p>
                <p title='delete post' style={{ fontSize: '15px' }} className='post-btn' onClick={deletePost}>🆇</p>
              </>
            }
          </div>
        </div>
        <div className='d-flex flex-column align-items-center justify-content-start flex-sm-row align-items-sm-start' >
          <Link to={`/profile/${post.owner._id}`} className="d-none d-sm-flex flex-column align-items-center">
            <div className="profile-pic icon" style={{ backgroundImage: `url(${post.owner.image})` }} alt="profile"></div>
          </Link>
          <div className="ms-sm-3" style={{ width: '100%' }}>
            {error && <small className='text-warning'>{error}</small>}
            <div >
              {toEdit ?
                <PostForm postFields={postFields} setPostFields={setPostFields} postError={postError} setPostError={setPostError} handlePostSubmit={handlePostSubmit} />
                :
                <div className="textBox m-0">
                  <Card.Title>{post.title} </Card.Title>
                  <Card.Text>{post.message}</Card.Text>
                </div>
              }
            </div>
            <div className='infoBox'>
              <div className='d-flex flex-column flex-sm-row align-items-sm-center' style={{ minHeight: '50px' }}>
                {/* like box */}
                <div className="d-flex align-items-center justify-content-end" style={{ width: '200px', height: '35px' }} onClick={handlePostLike}>
                  {likeStatus === 204 ?
                    <p className='like-btn' >👍</p>
                    :
                    <p className='like-btn liked'>❤️</p>
                  }
                  <div style={{ width: '160px' }}>
                    <small >
                      {post.likes.length === 0 ? <> Be the first to like</>
                        :
                        post.likes.length === 1 ? <> 1 Like</>
                          :
                          <>{post.likes.length} Likes</>
                      }
                    </small>
                  </div>
                </div>
                {/* comment box */}
                <div className="d-flex align-items-center justify-content-end" style={{ width: '215px', height: '35px' }} onClick={() => setOpen(!open)} aria-controls={postId} aria-expanded={open}>
                  <p className='like-btn' >💬</p>
                  <div style={{ width: '175px' }}>
                    <small>
                      {post.comments.length === 0 ? <> Be the first to comment</>
                        :
                        post.comments.length === 1 ? <> 1 Comment</>
                          :
                          <>{post.comments.length} Comments</>
                      }
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Collapse in={open} >
          <div id={postId} >
            <div className="d-flex flex-column align-items-end"> 
              <CommentForm commentField={commentField} setCommentField={setCommentField} commentError={commentError} setCommentError={setCommentError} handleCommentSubmit={handleCommentSubmit} />

              <div className='mt-4 d-flex flex-column align-items-end'>
                {commentHTML}
              </div>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Post