
const CommentForm = ({ commentField, setCommentField, error, setError, handleCommentSubmit }) => {

  //Comments
  function handleChange(e) {
    setCommentField({ ...commentField, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <form onSubmit={handleCommentSubmit}>
      {error && <small className='text-danger'>{error}</small>}
      <input className='comment-input' type='text' name='message' onChange={handleChange} value={commentField.message} placeholder='Leave a comment...' required />
      <button className='btn' style={{ padding: '7px 15px' }} >Post</button>
    </form>
  )
}

export default CommentForm