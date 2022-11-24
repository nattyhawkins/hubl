
const CommentForm = ({ commentField, setCommentField, error, setError, handleCommentSubmit }) => {

  //Comments
  function handleChange(e) {
    setCommentField({ ...commentField, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <form onSubmit={handleCommentSubmit}>
      <input className='comment-input' type='text' name='message' onChange={handleChange} value={commentField.message} placeholder='Leave a comment...' required />
      <button className='btn' style={{ padding: '7px 15px' }} >Comment</button>
      {error && <small className='text-danger'>{error}</small>}
    </form>
  )
}

export default CommentForm