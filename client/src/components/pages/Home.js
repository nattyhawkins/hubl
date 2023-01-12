import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { Container, Row, Col, Card, Collapse, Spinner } from 'react-bootstrap/'

import SearchBar from '../common/SearchBar'
import arrow from '../../assets/arrow-white.png'
import GroupForm from '../common/GroupForm'
import { isAuthenticated } from '../../helpers/auth'
import Footer from '../common/Footer'



const GroupIndex = ({ groupId }) => {

  const [open, setOpen] = useState(false)
  const [groups, setGroups] = useState([])
  const [searchedGroups, setSearchedGroups] = useState([])
  const [error, setError] = useState(false)
  const [skip, setSkip] = useState(0)
  const [groupFields, setGroupFields] = useState({
    name: '',
    bio: '',
    image: '',
    groupImage: '',
  })
  const [search, setSearch] = useState('')
  const navigate = useNavigate()


  useEffect(() => {
    const getData = async () => {
      try {
        setSearchedGroups([])
        const response = await axios.get(`/api/groups?${search}&skip=${skip}&limit=6`)
        console.log(response)
        setSearchedGroups(response.data)
      } catch (err) {
        console.log(err.response.data.message)
        setError(err.response.status === 404 ? err.response.data.message : 'Uh oh! Something went wrong...')
      }
    }
    getData()
  }, [skip, search])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        setGroups(data)
      } catch (err) {
        setError(err.message ? err.message : err.response.data.message)
      }
    }
    getData()
  }, [])

  const pageUp = async () => {
    try {
      const result = skip + 6
      setSkip(result)
    } catch (err) {
      setError(true)
    }
  }
  const pageDown = async () => {
    try {
      const result = skip - 6
      setSkip(result)
    } catch (err) {
      setError(err.message)
    }
  }

  const skipReset = async () => {
    try {
      setSkip(0)
    } catch (err) {
      setError(err.message)
    }
  }


  return (
    <>
      <main className='home-page'>
        <h2 className='text-center'>Find your new crew!</h2>
        <SearchBar
          setSearch={setSearch} />
        {/* {error && <small className='text-warning pt-3'>{error}</small>} */}
        <Container className='groups-container'>
          <button className='btn-left'
            style={{ backgroundImage: `url(${arrow})` }}
            onClick={pageDown}
            disabled={skip === 0}
          />
          {searchedGroups.length > 0 ?
            <Row className='groups-row text-center'>
              {searchedGroups.map(group => {
                const { name, _id, image, groupImage } = group
                return (
                  <Col md='4' key={_id} className='group-card my-2' >
                    <Link className='text-decoration-none ' to={`${_id}`}>
                      <Card style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image ? image : groupImage})` }}>
                        <div className='group-name'>{name}</div>
                      </Card>
                    </Link>
                  </Col>
                )
              })}
            </Row>
            :
            error ? 
              <h4 className='w-100 text-center err'>{error}</h4>
              : 
              <div className='w-100 d-flex justify-content-center' ><Spinner variant='warning'/></div>
          }
          <button
            className='btn-right'
            style={{ backgroundImage: `url(${arrow})` }}
            onClick={pageUp}
            disabled={searchedGroups.length < 6 || skip === groups.length - 6}
          />
        </Container>
        {isAuthenticated() ?
          <div className='adding-group'>
            <p className='look-for'>Don&apos;t find what you&apos;re looking for? </p>
            <button
              className='uni-btn text-center add-btn'
              onClick={() => setOpen(!open)}
              aria-controls={groupId}
              aria-expanded={open}>
              Make your own group!
            </button>
            <Collapse in={open}>
              <div className='mt-4 mb-5 text-center'>
                <GroupForm
                  groupFields={groupFields}
                  setGroupFields={setGroupFields}
                  error={error}
                  setError={setError}
                  groups={groups}
                />
              </div>
            </Collapse>
          </div>
          :
          <button
            className='uni-btn text-center login-btn my-3'
            onClick={() => navigate('/login')}>
            Login to create a Group
          </button>
        }
      </main>
    </>
  )

}

export default GroupIndex