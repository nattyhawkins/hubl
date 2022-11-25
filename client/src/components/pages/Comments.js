import axios from 'axios'
import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getToken, isOwner } from '../../helpers/auth'
import { getTimeElapsed } from '../../helpers/general'
import CommentForm from './CommentForm'


const Comments = ({ comment, groupId, postId, setRefresh, refresh }) => {
  const { owner, message, _id: commentId } = comment
  const [timeElapsed, setTimeElapsed] = useState(getTimeElapsed(comment.createdAt))
  const [toEdit, setToEdit] = useState(false)
  const [error, setError] = useState(false)
  const [likeStatus, setLikeStatus] = useState(() => {
    if (getToken() && comment.likes.some(like => isOwner(like.owner))) return 202
    return 204
  })
  const [commentField, setCommentField] = useState({
    message: '',
  })

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeElapsed(getTimeElapsed(comment.createdAt))
    }, 1000)
    return () => {
      clearInterval(tick)
    }
  }, [])

  //Edit comment
  async function editComment(e) {
    setToEdit(!toEdit)
    setCommentField({
      message: comment.message,
    })
  }
  //submit editted comment
  async function handleCommentSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login')
      await axios.put(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}`, commentField, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(!refresh)
      setToEdit(false)
      setCommentField({ message: '' })
    } catch (err) {
      setError(err.message ? err.message : err.response.data.message)
    }
  }
  //delete comment
  async function deleteComment(e) {
    try {
      e.preventDefault()
      await axios.delete(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(!refresh)
      setCommentField({ message: '' })
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  async function handleCommentLike(e) {
    try {
      if (!getToken()) throw new Error('Please login')
      e.preventDefault()
      const { status } = await axios.post(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}/likes`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setLikeStatus(status)
      setRefresh(!refresh)
    } catch (err) {
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  return (
    <Card className="textBox pb-0">
      <div className="d-flex justify-content-between">
        <div className='d-flex'>
          <Card.Title><Link to={`/profile/${owner._id}`} className="username">@{owner.username}</Link></Card.Title>
          <Card.Text><small>{timeElapsed}</small></Card.Text>
        </div>
        {isOwner(owner._id) &&
          <div className="d-flex justify-content-end">
            <p title='edit comment' className="me-2 subtle post-btn" onClick={editComment}>•••</p>
            <p title='delete comment' style={{ fontSize: '20px' }} className="subtle post-btn" onClick={deleteComment}>ⓧ</p>
          </div>}
      </div>
      {toEdit ?
        <CommentForm commentField={commentField} setCommentField={setCommentField} error={error} setError={setError} handleCommentSubmit={handleCommentSubmit} />
        :
        <>
          <Card.Text className='mb-0'>{message}</Card.Text>
        </>
      }
      <div className="d-flex align-items-center justify-content-end" style={{ width: '230px', height: '50px' }} onClick={handleCommentLike}>
        {likeStatus === 204 ?
          <p className='like-btn' >👍</p>
          :
          <p className='like-btn liked'>❤️</p>
        }
        <div style={{ width: '190px' }}>
          <small >
            {comment.likes.length === 0 ? <> Be the first to like</>
              :
              comment.likes.length === 1 ? <> 1 Like</>
                :
                <>{comment.likes.length} Likes</>
            }
          </small>
        </div>
      </div>
    </Card>
  )
}
export default Comments