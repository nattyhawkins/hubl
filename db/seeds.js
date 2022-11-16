import mongoose from 'mongoose'
import Group from '../models/group.js'
import User from '../models/user.js'
import userData from './data/users.js'
import groupData from './data/groups.js'
import { } from 'dotenv/config'


const seedDataBase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('db connected')
    await mongoose.connection.db.dropDatabase()
    console.log('db dropped')
    const users = await User.create(userData)
    console.log(`🤖 users collection seeded with ${users.length} users!`)
    const groupWithOwners = groupData.map(group => {
      const postsWithOwners = group.posts.map(post => {
        return { ...post, owner: users[1]._id }
      })
      return { ...group, owner: users[0]._id, posts: postsWithOwners }
    })
    const group = await Group.create(groupWithOwners)
    console.log(`🌱 group collection seeded with ${group.length} groups!`)
    await mongoose.connection.close()
    console.log('db closing 😴')
  } catch (err) {
    console.log('something went wrong! 🚨')
    console.log(err)
    await mongoose.connection.close()
  }
}
seedDataBase()