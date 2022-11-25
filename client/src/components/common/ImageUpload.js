import axios from 'axios'


const ImageUpload = ({ groupFields, setGroupFields, imageKey, setError }) => {


  const handleChange = async (event) => {
    try {

      const formData = new FormData()
      formData.append('file', event.target.files[0])
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
      setGroupFields({ ...groupFields, [imageKey]: data.secure_url })
    } catch (err) {
      setError(err.message ? err.message : err.response.data.message)
    }
  }



  return (
    <div className='field'>
      <label>or upload a group image:</label>
      <br />
      <input
        className='upload-input text-center'
        type='file'
        onChange={handleChange}
      />
    </div>
  )
}

export default ImageUpload