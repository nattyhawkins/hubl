
const CommentForm = ({ commentField, setCommentField, commentError, setCommentError, handleCommentSubmit }) => {

  //Comments
  function handleChange(e) {
    setCommentField({ ...commentField, [e.target.name]: e.target.value })
    if (commentError) setCommentError('')
  }

  return (
    <>
      <form onSubmit={handleCommentSubmit} className="d-flex flex-column align-items-end flex-sm-row align-items-sm-center" style={{ width: 'calc(100% - 115px)' }}>
        <input className='comment-input m-0' type='text' name='message' onChange={handleChange} value={commentField.message} placeholder='Leave a comment...' required style={{ border: '1px solid black' }}/>
        <button className='btn mt-2 mt-sm-0' style={{ padding: '10px 15px' }} >Comment</button>
      </form>
      {commentError && <small className='text-warning'>{commentError}</small>}
    </>
  )
}

export default CommentForm