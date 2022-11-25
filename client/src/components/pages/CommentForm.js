
const CommentForm = ({ commentField, setCommentField, error, setError, handleCommentSubmit }) => {

  //Comments
  function handleChange(e) {
    setCommentField({ ...commentField, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <form onSubmit={handleCommentSubmit} className="d-flex align-items-center" style={{ width: 'calc(100% - 115px)' }}>
      <input className='comment-input m-0' type='text' name='message' onChange={handleChange} value={commentField.message} placeholder='Leave a comment...' required />
      <button className='btn' style={{ padding: '10px 15px' }} >Comment</button>
      {error && <small className='text-danger'>{error}</small>}
    </form>
  )
}

export default CommentForm