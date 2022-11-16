import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'






const GroupSingle = () => {

  const [groups, setGroups] = useState([])
  const [errors, setErrors] = useState([])

  const { groupId } = useParams()

  useEffect(() => {
    const getGroup = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupId}`)
        console.log('single group data =>', data)
      } catch (err) {
        console.log(err)
        setErrors(err)
      }
    }
    getGroup()
  }, [groupId])






  return (
    <main className='GroupSingle'>
      <h1>Posts single</h1>
    </main>
  )
}
export default GroupSingle