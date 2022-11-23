import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import GroupSingle from './components/pages/GroupSingle'
import TheNavbar from './components/common/TheNavbar'
import NotFound from './components/pages/NotFound'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Footer from './components/common/Footer'
import Profile from './components/pages/Profile'

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
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/:groupId' element={<GroupSingle />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App
