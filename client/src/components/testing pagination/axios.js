import axios from 'axios'


export const getGroupsPage = async (pageParam = 1) => {
  const response = await axios.get(`/api/groups?_page=${pageParam}`)
  return response.data
}

