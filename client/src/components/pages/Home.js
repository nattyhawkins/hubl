import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { Container, Row, Col, Card, Collapse } from 'react-bootstrap/'

import SearchBar from '../common/SearchBar'
import arrow from '../../assets/arrow-white.png'
import GroupForm from '../common/GroupForm'
import ImageUpload from '../common/ImageUpload'



const GroupIndex = ({ groupId }) => {

  const [open, setOpen] = useState(false)
  const [groups, setGroups] = useState([])
  const [groupNumber, setGroupNumber] = useState(null)

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



  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/groups?${search}&skip=${skip}&limit=6`)
        setSearchedGroups(data)
        console.log('data', data)
      } catch (err) {
        console.log(err.message)
        setError(true)
      }
    }
    getData()
  }, [skip, search])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        console.log('whats this', data.length)
        setGroups(data)
      } catch (err) {
        console.log(err.message)
        setError(true)
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
      setError(true)
    }
  }

  const skipReset = async () => {
    try {
      setSkip(0)
    } catch (err) {
      setError(true)
    }
  }

  return (
    <>
      <main className='group-index'>
        <h2 className='text-center'>Find a group that interests you!</h2>
        <SearchBar groups={groups}
          setSearchedGroups={setSearchedGroups}
          searchedGroups={searchedGroups}
          search={search}
          setSearch={setSearch} />
        <Container className='groups-container'>
          <button className='btn-left'
            style={{ backgroundImage: `url(${arrow})` }}
            onClick={pageDown}
            disabled={skip === 0}
          />
          {searchedGroups.length ?
            <Row className='groups-row text-center'>
              {searchedGroups.map(group => {
                const { name, _id, image } = group
                return (
                  <Col md='4' key={_id} className='group-card' >
                    <Link className='text-decoration-none' to={`${_id}`}>
                      <Card style={{ backgroundImage: `url(${image})` }}>
                        <div></div>
                        <div className='group-name'>{name}</div>
                      </Card>
                    </Link>
                  </Col>
                )
              })}
            </Row>
            :
            error ? <p>something went wrong...</p> : <p>loading...</p>
          }
          <button
            className='btn-right'
            style={{ backgroundImage: `url(${arrow})` }}
            onClick={pageUp}
            disabled={searchedGroups.length < 6 || skip === groups.length - 6}
          />
        </Container>
        <button className='uni-btn text-center add-btn' onClick={() => setOpen(!open)} aria-controls={groupId} aria-expanded={open}>Add your own group</button>
        <Collapse in={open}>
          <div className='adding-group'>
            <div className='mt-4 mb-5 text-center'>
              <GroupForm
                groupFields={groupFields}
                setGroupFields={setGroupFields}
                error={error}
                setError={setError}
                groups={groups}
              />
            </div>
          </div>
        </Collapse>
      </main >
    </>
  )
}
export default GroupIndex