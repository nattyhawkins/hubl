import express from 'express'
import mongoose from 'mongoose'
import {} from 'dotenv/config'

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
    // app.use(router)

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


