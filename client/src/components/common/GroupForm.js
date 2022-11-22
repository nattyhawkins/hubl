import { Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../helpers/auth.js'


const GroupForm = ({ groupFields, setGroupFields, error, setError }) => {


  const navigate = useNavigate()


  function handleChange(e) {
    setGroupFields({ ...groupFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }


  async function handleSubmit(e) {
    try {
      e.preventDefault()
      const { data } = await axios.post('api/groups', groupFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('group posted')
      setGroupFields({ name: '', bio: '', image: '' })
      navigate(`/${data._id}`)
    } catch (err) {
      console.log('EDIT FAIL ->', err.response.data.message)
      setError(err.response.data.message)
    }
  }





  return (
    <Card className='group-form'>
      <form onSubmit={handleSubmit}>
        <input
          className='group-input'
          type='text'
          name='name'
          onChange={handleChange}
          value={groupFields.name}
          placeholder='Group Name'
          required />
        <textarea
          className='text-area'
          type='text'
          name='bio'
          onChange={handleChange}
          value={groupFields.bio}
          placeholder='Group Description'
          required />
        <input
          className='group-input'
          type='text'
          name='image'
          onChange={handleChange}
          value={groupFields.image}
          placeholder='Link a picture' />
        {error && <small className='text-danger'>{error}</small>}
        <br />
        <button className='group-create-btn'>Create Group</button>
      </form>
    </Card>
  )

}

export default GroupForm