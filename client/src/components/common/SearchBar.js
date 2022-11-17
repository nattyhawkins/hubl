import { useEffect, useState } from 'react'


const SearchBar = ({ groups, setSearchedGroups }) => {

  const [searchInput, setSearchInput] = useState({
    search: '',
  })

  useEffect(() => {
    const regex = new RegExp(searchInput.search, 'i')
    const searchedArray = groups.filter(group => {
      return regex.test(group.name)
    })
    setSearchedGroups(searchedArray)
  }, [searchInput, groups, setSearchedGroups])

  const handleChange = (e) => {
    setSearchInput({ ...searchInput, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className='search-function'>
        <input onChange={handleChange}
          type='text'
          placeholder='search group name here'
          name='search'
          value={searchInput.search} />
      </div>
    </>
  )


}


export default SearchBar