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

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        setGroups(data)
        setSearchedGroups(data)
        console.log('group index data =>', data)
      } catch (err) {
        console.log(err.message)
        setError(true)
      }
    }
    getData()
  }, [])




  return (
    <main className='group-index'>
      <Container className='groups-container'>
        <SearchBar groups={groups}
          setSearchedGroups={setSearchedGroups}
          searchedGroups={searchedGroups} />
        {searchedGroups.length ?
          <Row>
            {searchedGroups.map(group => {
              const { name, _id, bio } = group
              return (
                <Col key={_id} sm='6' md='3' className='group-card'>
                  <Card>
                    <Link to={`${_id}`}>
                      <h2>{name}</h2>
                    </Link>
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
      </Container>
      <h1>group index</h1>
    </main>
  )
}
export default GroupIndex