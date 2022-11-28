import ImageUpload from './ImageUpload'


const GroupEditForm = ({ groupFields, setGroupFields, groupError, setGroupError, handleGroupSubmit }) => {

  function handleChange(e) {
    setGroupFields({ ...groupFields, [e.target.name]: e.target.value })
    if (groupError) setGroupError('')
  }

  return (
    <form className='group-edit-form ' onSubmit={handleGroupSubmit} >
      <div className='name-bio-form'>
        <div className='form-group'>
          <label className='grp-name'>Group Name:</label>
          <br />
          <input
            className='group-input'
            type='text'
            name='name'
            onChange={handleChange}
            value={groupFields.name}
            placeholder='Group Name'
            required />
        </div>
        <div className='form-group'>
          <label>Group Description:</label>
          <textarea
            className='text-area'
            type='text'
            name='bio'
            onChange={handleChange}
            value={groupFields.bio}
            placeholder='Group Description'
            required />
        </div>
      </div>
      <div className='image-form'>
        <div className='form-group'>
          <label>Link an Image:</label>
          <input
            className='group-input'
            type='text'
            name='image'
            onChange={handleChange}
            value={groupFields.image}
            placeholder='Link an Image' />
        </div>
        <div className='form-group'>
          <ImageUpload
            groupFields={groupFields}
            setGroupFields={setGroupFields}
            imageKey={'groupImage'}
          />
          {groupError && <small className='text-warning pt-3'>{groupError}</small>}
        </div>
      </div>
      <button className='uni-btn group-edit-btn'>Finish Edit</button>
    </form>
  )

}

export default GroupEditForm