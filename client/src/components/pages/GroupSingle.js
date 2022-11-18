import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Col, Row, Container, Collapse } from 'react-bootstrap'
import { v4 as uuid } from 'uuid'
import Post from './Post'
import { getToken } from '../../helpers/auth'



const GroupSingle = () => {

  const [ group, setGroup ] = useState([])
  const [ error, setError ] = useState(false)
  const [ refresh, setRefresh ] = useState(false)

  const [ postFields , setPostFields ] = useState({
    title: '',
    message: '',
    tags: [],
  })

  // const [ tag, setTag ] = useState('')

  const { groupId } = useParams()


  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        console.log('single group data =>', data)
        setGroup(data)
      } catch (err) {
        setError(err)
      }
    }
    getGroup()
    // document.getElementById('tagInput').addEventListener('keypress', function (e) {
    //   if (e.key === 'Enter') {
    //     handleTagSubmit()
    //   }
    // })
  }, [groupId, refresh])


  // function handleTagChange(e){
  //   setTag(e.target.value)
  // }

  // function handleTagSubmit(){
  //   console.log(tag)
  //   const tagElement = document.createElement('p')
    
  //   tagElement.innerHTML = tag
  //   document.getElementById('tagDisplay').appendChild(tagElement)
  //   const newTags = postFields.tags.push(tag)
  //   setPostFields({ ...postFields, tags: newTags })
  //   setTag('')

  // }

  function handleChange(e){
    setPostFields({ ...postFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

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

  

  return (
    <main className='group-single'>
      {group ?
        <>
          <div className='banner'>
            <Container className='bannerContainer'>
              <Col className='col-md-8 title'>
                <h5>Welcome to</h5>
                <h1>{group.name}</h1>
              </Col>
              <Col className="col-md-4 bio justify-end">
                <p>{group.bio}</p>
              </Col>
            </Container>
          </div>
          <Row>
            <Container className='mainContainer'>
              <Card className="post">
                <form onSubmit={handleSubmit}>
                  <input type="text" name="title" onChange={handleChange} value={postFields.title} placeholder="Title..." required/>
                  <input type="text" name="message" onChange={handleChange} value={postFields.message} placeholder="Write a bit more..." required/>
                  {/* <div id="tagDisplay"></div>
                  <input id="tagInput" type="text" name="tags" onChange={handleTagChange} value={tag} placeholder="Tag it"/> */}
                  {error && <small className='text-danger'>{error}</small>}
                  <button className="btn" >Send</button>
                </form>
              </Card>
              {group.posts && group.posts.map(post => {
                const { title, message, tags, _id, comments, owner } = post
                
                const tagsHTML = tags.map(tag => {
                  const tagWithId = { tag: tag, id: uuid() }
                  return <Card.Subtitle key={tagWithId.id} className="tag">#{tagWithId.tag}</Card.Subtitle>
                })
                const commentHTML = comments.map(comment => {
                  const { message, _id, owner } = comment
                  return (
                    <Card key={_id} className="textBox">
                      <Card.Title className="userName">@{owner.username}</Card.Title>
                      <Card.Text>{message}</Card.Text>
                    </Card>
                  )
                })
                return (
                  <Post key={_id} _id={_id} message={message} owner={owner} comments={comments} commentHTML={commentHTML} tagesHTML={tagsHTML} title={title} groupId={groupId} setRefresh={setRefresh} refresh={refresh}/>
                )
              })}
            </Container>
          </Row>
        </>
        : <h2>error</h2>
      }

    </main >
  )
}
export default GroupSingle