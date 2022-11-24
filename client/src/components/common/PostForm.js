import { Button, Card } from 'react-bootstrap'

const PostForm = ({ postFields, setPostFields, error, setError, handlePostSubmit }) => {



  function handleChange(e) {
    setPostFields({ ...postFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <Card className='post'>
      <form onSubmit={handlePostSubmit} className="d-flex" >
        <div className="w-100">
          <input  type='text' name='title' onChange={handleChange} value={postFields.title} placeholder='Title...' required />
          <input type='text' name='message' onChange={handleChange} value={postFields.message} placeholder='Write a bit more...' required />
          {error && <small className='text-danger'>{error}</small>}
        </div>
        <button className='btn' >Send</button>
      </form>
    </Card>
  )
}

export default PostForm