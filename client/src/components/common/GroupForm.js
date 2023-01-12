import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../helpers/auth.js'
import ImageUpload from './ImageUpload'


const GroupForm = ({ groupFields, setGroupFields, error, setError, groups }) => {


  const navigate = useNavigate()


  function handleChange(e) {
    setGroupFields({ ...groupFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  //submit new group
  async function handleSubmit(e) {
    try {
      e.preventDefault()
      if (!getToken()) throw new Error('Please login to create a group')
      if (groupFields.bio.length > 200 || groupFields.name.length > 50) throw new Error('Character limit exceeded!')
      if (groups.some(group => group.name === groupFields.name)) throw new Error('Group already exists')
      const { data } = await axios.post('api/groups', groupFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setGroupFields({ name: '', bio: '', image: '', groupImage: '' })
      navigate(`/${data._id}`)
    } catch (err) {
      setError(err.message ? err.message : err.response.data.message)
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
          placeholder='Group Name *'
          required />
        <br />
        <textarea
          className='text-area'
          type='text'
          name='bio'
          onChange={handleChange}
          value={groupFields.bio}
          placeholder='Group Description *'
          required />
        <br />
        <input
          className='group-input'
          type='text'
          name='image'
          onChange={handleChange}
          value={groupFields.image}
          placeholder='Link an Image' />
        <ImageUpload
          groupFields={groupFields}
          setGroupFields={setGroupFields}
          imageKey={'groupImage'}
        />
        <br />
        {error && <small className='text-warning'>{error}</small>}
        <br />
        <button className='uni-btn group-create-btn'>Create Group</button>
      </form>
    </Card>
  )

}

export default GroupForm