import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Group from './components/Group'
import PostSingle from './components/PostSingle'
import TheNavbar from './components/TheNavbar'

const App = () => {

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data } = await axios.get('/api/products/') // * <-- replace with your endpoint
  //     console.log(data)
  //   }
  //   getData()
  // })

  return (
    <>
      <BrowserRouter>
        <TheNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:groupName' element={<Group />} />
          <Route path='/:groupName/:postId' element={<PostSingle />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
