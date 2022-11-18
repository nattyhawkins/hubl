import { useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'



const Post = ({ _id, message, owner, comments, commentHTML, tagsHTML, title }) => {

  const [ open, setOpen ] = useState(false)

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