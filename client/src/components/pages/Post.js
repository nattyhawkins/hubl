import axios from 'axios'
import { useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import { getToken } from '../../helpers/auth'



const Post = ({ _id, message, owner, comments, commentHTML, tagsHTML, title, groupId, setRefresh, refresh }) => {

  const [ open, setOpen ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ comment , setComment ] = useState({
    message: '',
  })


  function handleChange(e){
    setComment({ ...comment, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e){
    try {
      e.preventDefault()
      await axios.post(`api/groups/${groupId}/posts/${_id}/comments`, comment, { headers: {
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


  return (
    <Card key={_id} className="post">
      <Card.Body>
        <div className="textBox">
          <Card.Title><span className="username">@{owner.username}</span> {title}</Card.Title>
          <Card.Text>{message}</Card.Text>
        </div>
        <div className="infoBox">
          <button >👍 Likes</button>
          <button className="btn" onClick={() => setOpen(!open)} aria-controls={_id} aria-expanded={open} >💬 {comments.length} Comments</button>
          <div className="tagDiv">
            {tagsHTML}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="message" onChange={handleChange} value={comment.message} placeholder="Comment..." required/>
          {error && <small className='text-danger'>{error}</small>}
          <button className="btn" >Send</button>
        </form>
        <Collapse in={open}>
          <div id={_id}>
            {commentHTML}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Post