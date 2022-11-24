import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
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
      console.log('Edit comment success')
      setRefresh(!refresh)
      setToEdit(false)
      setCommentField({ message: '' })
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
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
      console.log('delete comment success')
      setRefresh(!refresh)
      setCommentField({ message: '' })
    } catch (err) {
      console.log(err.response.data.message)
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
      console.log('like comment success')
      setRefresh(!refresh)
    } catch (err) {
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }

  return (
    <Card className="textBox">
      {isOwner(owner._id) &&
        <div className="d-flex justify-content-end">
          <button className="me-2 subtle" onClick={editComment}>Edit</button>
          <button className="subtle" onClick={deleteComment}>Delete</button>
        </div>}
      <Card.Title><Link to={`/profile/${owner._id}`} className="username">@{owner.username}</Link></Card.Title>
      {toEdit ?
        <CommentForm commentField={commentField} setCommentField={setCommentField} error={error} setError={setError} handleCommentSubmit={handleCommentSubmit} />
        :
        <>
          <Card.Text>{message}</Card.Text>

        </>
      }
      <Card.Text>{timeElapsed}</Card.Text>
      <div className="d-flex">
        {likeStatus === 204 ?
          <Button className="likeBtn" onClick={handleCommentLike}>👍</Button>
          :
          <Button className="likeBtn liked" onClick={handleCommentLike}>❤️</Button>
        }
        <Card.Text>
          {comment.likes.length === 0 ? <>Be the first to like</>
            :
            comment.likes.length === 1 ? <>1 Like</>
              :
              <>{comment.likes.length} Likes</>
          }
        </Card.Text>
      </div>
    </Card>

  )
}
export default Comments