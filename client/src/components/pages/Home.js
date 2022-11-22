import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import SearchBar from '../common/SearchBar'
import arrow from '../../assets/arrows.png'
import GroupForm from '../common/GroupForm'


const GroupIndex = () => {


  const [groups, setGroups] = useState([])
  const [groupNumber, setGroupNumber] = useState(null)
  const [searchedGroups, setSearchedGroups] = useState([])
  const [error, setError] = useState(false)
  const [skip, setSkip] = useState(0)
  const [groupFields, setGroupFields] = useState({
    name: '',
    bio: '',
    image: '',
  })



  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/groups?skip=${skip}&limit=6`)
        setGroups(data)
        setSearchedGroups(data)
        console.log('skip', skip)
        console.log(groupNumber - (groupNumber % 6))
      } catch (err) {
        console.log(err.message)
        setError(true)
      }
    }
    getData()
  }, [skip])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        console.log('whats this', data.length)
        setGroupNumber(data.length)
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
    <main className='group-index'>
      <h2 className='text-center'>Find a group that interests you!</h2>
      <SearchBar groups={groups}
        setSearchedGroups={setSearchedGroups}
        searchedGroups={searchedGroups} />
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
                    <Card className='card-img' style={{ backgroundImage: `url(${image})` }}>
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
          disabled={groups.length < 6 || skip === groupNumber - 6}

        />
      </Container>
      <h2 className='text-center mt-5'>Add your own group:</h2>
      <div className='mt-4 mb-5  text-center'>
        <GroupForm
          className='group-form'
          groupFields={groupFields}
          setGroupFields={setGroupFields}
          error={error}
          setError={setError}
        />
      </div>
    </main >
  )
}
export default GroupIndex