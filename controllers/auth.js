import User from '../models/user.js'

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