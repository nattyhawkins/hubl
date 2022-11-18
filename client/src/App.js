import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import GroupSingle from './components/pages/GroupSingle'
import TheNavbar from './components/common/TheNavbar'
import NotFound from './components/pages/NotFound'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import PostSingle from './components/pages/PostSingle'
import Footer from './components/common/Footer'

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
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/:groupId' element={<GroupSingle />} />
          <Route path='/:groupId/:postId' element={<PostSingle />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App
