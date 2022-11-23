import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../helpers/auth.js'
import ImageUpload from './ImageUpload'


const GroupEditForm = ({ groupFields, setGroupFields, error, setError, groups, handleGroupSubmit }) => {

  function handleChange(e) {
    setGroupFields({ ...groupFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  return (
    <Card className='group-form'>
      <form onSubmit={handleGroupSubmit}>
        <input
          className='group-input'
          type='text'
          name='name'
          onChange={handleChange}
          value={groupFields.name}
          placeholder='Group Name'
          required />
        <br />
        <textarea
          className='text-area'
          type='text'
          name='bio'
          onChange={handleChange}
          value={groupFields.bio}
          placeholder='Group Description'
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
        {error && <small className='text-danger'>{error}</small>}
        <br />
        <button className='uni-btn group-create-btn'>Edit Group</button>
      </form>
    </Card>
  )

}

export default GroupEditForm