import { Card } from 'react-bootstrap'

const PostForm = ({ postFields, setPostFields, postError, setPostError, handlePostSubmit }) => {



  function handleChange(e) {
    setPostFields({ ...postFields, [e.target.name]: e.target.value })
    if (postError) setPostError('')
  }

  return (
    <Card className='post'>
      <Card.Body className='py-0 px-0 px-sm-2 px-lg-4'>
        <form onSubmit={handlePostSubmit} className="d-flex " >
          <div className="w-100">
            <input type='text' name='title' onChange={handleChange} value={postFields.title} placeholder='Post-Title...' required />
            <input type='text' name='message' onChange={handleChange} value={postFields.message} placeholder='Write a bit more...' required className='mb-0'/>
          </div>
          <button className='btn' style={{ padding: '7px 15px' }}>Post</button>
        </form>
        {postError && <small className='text-warning'>{postError}</small>}
      </Card.Body>
    </Card>
  )
}

export default PostForm