import { useEffect, useState } from 'react'
import { getGroupsPage } from './axios.js'
import Groups from './Groups.js'
import Home from '../pages/Home.js'


const Example1 = () => {
  const [page, setPage] = useState(1)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getGroupsPage(page).then(json => setGroups(json))
  }, [page])

  const content = groups.map(groups => <Groups key={groups._id} groups={groups} />)
  const nextPage = () => setPage(prev => prev + 1)
  const prevPage = () => setPage(prev => prev - 1)


  return (
    <>
      <nav>
        <button onClick={prevPage} disabled={page === 1}>Prev Page</button>
        <button onClick={nextPage} disabled={!groups.length}>Next Page</button>
      </nav>
      {content}
    </>
  )






}

export default Example1