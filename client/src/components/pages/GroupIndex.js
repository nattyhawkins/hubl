import { useState, useEffect } from 'react'
import axios from 'axios'





const GroupIndex = () => {


  const [groups, setGroups] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/groups')
        setGroups(data)
        console.log('group index data =>', data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])




  return (
    <main className='group-index'>
      {/* <Container className='groups-container'>

      </Container> */}
      <h1>group pg</h1>
    </main>
  )
}
export default GroupIndex