import { Unauthorised } from './errors.js'
import {} from 'dotenv/config'
import user from '../models/user'
import { sendErrors } from './helpers'
import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) throw new Unauthorised('Missing headers')
    const token = auth.replace('Bearer ', '')
    const payload = jwt.verify(token, process.env.secret)
    const userToLogIn = await user.findById(payload.sub)
    if (!userToLogIn) throw new Unauthorised()

    // Pass on credentials by saving to a new key on the request
    req.currentUser = userToLogIn

    next()
  } catch (err) {
    sendErrors
  }
}