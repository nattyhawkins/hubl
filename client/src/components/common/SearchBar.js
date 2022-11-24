import { useState } from 'react'


const SearchBar = ({ setSearch }) => {

  const [searchInput, setSearchInput] = useState('')

  const handleInput = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(`&search=${searchInput}`)
  }

  return (
    <>
      <div className='search-function text-center'>
        <form onSubmit={handleSearch}>
          <input className='text-center mb-2 search-input' onChange={handleInput}
            type='search'
            placeholder='Search your wildest dreams...'
            name='search'
            value={searchInput} />
        </form>
      </div>
    </>
  )


}


export default SearchBar