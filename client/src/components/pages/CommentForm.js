
const CommentForm = ({ commentField, setCommentField, error, setError, handleCommentSubmit }) => {

  //Comments
  function handleChange(e){
    setCommentField({ ...commentField, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <form onSubmit={handleCommentSubmit}>
      {error && <small className='text-danger'>{error}</small>}
      <input type="text" name="message" onChange={handleChange} value={commentField.message} placeholder="Comment..." required/>
      <button className="btn" >Send</button>
    </form>
  )
}

export default CommentForm