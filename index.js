import express from 'express'
import mongoose from 'mongoose'
import { } from 'dotenv/config'
import router from './config/router.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('DB running')
    // ! Middleware
    //convert body to json
    app.use(express.json())

    //General Log
    app.use((req, _res, next) => {
      console.log(`🕊 New request received: ${req.method} - ${req.url}`)
      next()
    })

    //router
    app.use('/api', router)

    app.use(express.static(path.join(__dirname, 'client', 'build')))
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
    //catch all
    app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

    //listen for requests
    app.listen(process.env.PORT, () => `server running in ${process.env.PORT}`)
  } catch (err) {
    console.log('errorrrr')
    console.log(err)
  }
}
startServer()


