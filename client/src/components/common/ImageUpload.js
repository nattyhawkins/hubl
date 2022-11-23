import axios from 'axios'


const ImageUpload = (groupFields, setGroupFields) => {


  const handleChange = async (event) => {
    try {

      const formData = new FormData()
      formData.append('file', event.target.files[0])
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
      setGroupFields({ ...groupFields, groupImage: data.secure_url })
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div className='field'>
      <label>Profile Image</label>
      <input
        className='input'
        type='file'
        onChange={handleChange}
      />
    </div>
  )
}

export default ImageUpload