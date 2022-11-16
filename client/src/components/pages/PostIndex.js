// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Link } from 'react-router-dom'

// import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/row'
// import Col from 'react-bootstrap/Col'
// import Card from 'react-bootstrap/Card'


// const PostIndex = ({ group }) => {


//   return (
//     {
//       group.map(post => {
//         const { posts } = post
//         return (
//           <p>{posts}</p>
//         )
//       })
//     }
//   )









//   const [groups, setGroups] = useState([])
//   const [errors, setErrors] = useState([])


//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const { data } = await axios.get('/api/groups/')
//         setGroups(data)
//         console.log('post index data =>', data)
//       } catch (err) {
//         console.log(err)
//         setErrors(true)
//       }
//     }
//     getData()
//   }, [])

// }

// export default PostIndex