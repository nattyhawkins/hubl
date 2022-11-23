import { useEffect, useState } from 'react'


const SearchBar = ({ groups, setSearchedGroups, search, setSearch }) => {


  const [searchInput, setSearchInput] = useState('')



  const handleInput = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(`&search=${searchInput}`)
    console.log('searchinput', searchInput)
  }




  // useEffect(() => {
  //   const regex = new RegExp(searchInput.search, 'i')
  //   const searchedArray = groups.filter(group => {
  //     return regex.test(group.name)
  //   })
  //   setSearchedGroups(searchedArray)
  // }, [searchInput, groups, setSearchedGroups])


  return (
    <>
      <div className='search-function text-center'>
        <form onSubmit={handleSearch}>
          <input className='text-center mb-2 group-search' onChange={handleInput}
            type='search'
            placeholder='search for a group'
            name='search'
            value={searchInput} />
        </form>
      </div>
    </>
  )


}


export default SearchBar