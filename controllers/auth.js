import { Unauthorised } from '../config/errors.js'
import { sendErrors } from '../config/helpers.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { } from 'dotenv/config'

export const registerUser = async (req, res) => {
  try {
    console.log('attempting registerrrr')
    const newUser = await User.create(req.body)
    console.log('registered')
    return res.status(202).json({ message: `Welcome ${newUser.username}` })
  } catch (err) {
    console.log(err)
    console.log('reg user catch')
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
      throw new Unauthorised()
    }
    //token
    const payload = {
      sub: targetUser._id,
      username: targetUser.username,
    }
    const token = jwt.sign(payload, process.env.secret, { expiresIn: '7 days' })
    return res.json({ message: `Weclome back ${targetUser.username}`, token: token })
  } catch (err) {
    console.log(err.message)
    sendErrors(res, err)
  }
}
