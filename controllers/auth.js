import { Unauthorised } from '../config/errors.js'
import { sendErrors } from '../config/helpers.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { } from 'dotenv/config'

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const targetUser = await User.findOne({ username: username })
    const targetEmail = await User.findOne({ email: email })
    if (targetUser) throw new Error('User already exists')
    if (username.length < 3) throw new Error('Username too short')
    if (targetEmail) throw new Error('Email already used')
    if (password.length < 3) throw new Error('Password too short')
    const newUser = await User.create(req.body)
    return res.status(202).json({ message: `Welcome ${newUser.username}` })
  } catch (err) {
    console.log(err)
    res.status(422).json({ message: err.message })
  }

}

export const loginUser = async (req, res) => {
  try {
    console.log('attempt login')
    const { username, password } = req.body
    const targetUser = await User.findOne({ username: username })
    //validate
    if (!targetUser || !targetUser.validatePassword(password)) {
      throw new Unauthorised('Wrong Username or Password')
    }
    //token
    const payload = {
      sub: targetUser._id,
      username: targetUser.username,
    }
    const token = jwt.sign(payload, process.env.secret, { expiresIn: '7 days' })
    return res.json({ message: `Welcome back ${targetUser.username}`, token: token })
  } catch (err) {
    console.log(err.message)
    sendErrors(res, err)
  }
}
