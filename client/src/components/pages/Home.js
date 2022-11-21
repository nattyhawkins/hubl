import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import SearchBar from '../common/SearchBar'


const GroupIndex = () => {


  const [groups, setGroups] = useState([])
  const [searchedGroups, setSearchedGroups] = useState([])
  const [error, setError] = useState(false)
  const [skip, setSkip] = useState(0)

  // const [groupFields, setGroupFields] = useState({
  //   name: '',
  //   bio: '',
  // })





  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/groups?skip=${skip}`)
        setGroups(data)
        setSearchedGroups(data)

        console.log('group index data =>', data)
      } catch (err) {
        console.log(err.message)
        setError(true)
      }
    }
    getData()
  }, [skip])

  const pageUp = async (e) => {
    try {
      const result = skip + 6
      setSkip(result)
      console.log('group length', groups.length)
      console.log('result', skip)
    } catch (err) {
      setError(true)
    }
  }
  const pageDown = async (e) => {
    try {
      const result = skip - 6
      setSkip(result)
      console.log('group length', groups.length)
      console.log('result', skip)
    } catch (err) {
      setError(true)
    }
  }


  return (
    <main className='group-index'>
      <Container className='groups-container mt-4'>
        <h1 className='text-center'>Find a group that interests you!</h1>
        <SearchBar groups={groups}
          setSearchedGroups={setSearchedGroups}
          searchedGroups={searchedGroups} />
        {searchedGroups.length ?
          <Row>
            {searchedGroups.map(group => {
              const { name, _id, bio } = group
              return (
                <Col sm='6' md='3' key={_id} className='group-card mb-4'>
                  <Card>
                    <Link className='text-decoration-none text-center' to={`${_id}`}>{name}</Link>
                    <div className='card-image'></div>
                    <Card.Body>
                      <p>{bio}</p>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
          :
          error ? <p>something went wrong...</p> : <p>loading...</p>
        }
        <button className='page-btn' onClick={pageUp} disabled={skip === 14 - (14 % 6)}>up</button>
        <button className='page-btn' onClick={pageDown} disabled={skip === 0}>down</button>
      </Container>
    </main>
  )
}
export default GroupIndex