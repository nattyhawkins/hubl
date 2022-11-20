const PostNew = () => {

  async function handleSubmit(e){
    try {
      e.preventDefault()
      await axios.post(`api/groups/${groupId}/posts`, postFields, { headers: {
        Authorization: `Bearer ${getToken()}`,
      } })
      console.log('post success')
      setRefresh(!refresh)
      setPostFields({ title: '', message: '', tags: [] })
    } catch (err) {
      console.log(err.response.data.message)
      setError(err.response.data.message)
    }
  }

  return

}

export default PostNew