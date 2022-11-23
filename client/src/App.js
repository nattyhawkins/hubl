import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import GroupSingle from './components/pages/GroupSingle'
import TheNavbar from './components/common/TheNavbar'
import NotFound from './components/pages/NotFound'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Footer from './components/common/Footer'

const App = () => {

  return (
    <>
      <BrowserRouter>
        <TheNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
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
