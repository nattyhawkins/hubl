import axios from 'axios'
import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { getToken } from '../../helpers/auth'

const PostForm = ({ postFields, setPostFields, error, setError, handlePostSubmit }) => {
  
  

  function handleChange(e){
    setPostFields({ ...postFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <Card className="post">
      <form onSubmit={handlePostSubmit}>
        <input type="text" name="title" onChange={handleChange} value={postFields.title} placeholder="Title..." required/>
        <input type="text" name="message" onChange={handleChange} value={postFields.message} placeholder="Write a bit more..." required/>
        {/* <div id="tagDisplay"></div>
        <input id="tagInput" type="text" name="tags" onChange={handleTagChange} value={tag} placeholder="Tag it"/> */}
        {error && <small className='text-danger'>{error}</small>}
        <button className="btn" >Send</button>
      </form>
    </Card>
  )
}

export default PostForm