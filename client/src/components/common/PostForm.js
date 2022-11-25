import { Card } from 'react-bootstrap'

const PostForm = ({ postFields, setPostFields, error, setError, handlePostSubmit }) => {



  function handleChange(e) {
    setPostFields({ ...postFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <Card className='post'>
      <Card.Body className='py-0'>
        <form onSubmit={handlePostSubmit} className="d-flex " >
          <div className="w-100">
            <input type='text' name='title' onChange={handleChange} value={postFields.title} placeholder='Post-Title...' required />
            <input type='text' name='message' onChange={handleChange} value={postFields.message} placeholder='Write a bit more...' required className='mb-0'/>
            {error && <small className='text-danger'>{error}</small>}
          </div>
          <button className='btn' style={{ padding: '7px 15px' }}>Post</button>
        </form>
      </Card.Body>
    </Card>
  )
}

export default PostForm