import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

//define registration schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3 },
  bio: { type: String, maxlength: 500, default: 'Add bio here...' },
  image: { type: String },
  // joinedGroups: [{ type: mongoose.Schema.ObjectId, ref: 'Group', required: true }],
}, {
  strictPopulate: false,
})

userSchema
  .virtual('passwordConfirmation')
  .set(function (fieldValue) {
    this._passwordConfirmation = fieldValue
  })

userSchema.set('toJSON', {
  transform(_doc, json) {
    delete json.password
    return json
  },
  virtuals: true,
})

//check password match - custom pre validation
userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this._passwordConfirmation !== this.password) {
      this.invalidate('passwordConfirmation', 'Passwords do not match')
    }
    next()
  })

userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12))
    }
    next()
  })

userSchema.methods.validatePassword = function (plainTextPassword) {
  return bcrypt.compareSync(plainTextPassword, this.password)
}

userSchema.virtual('myGroups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.virtual('joinedGroups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'members.owner',
})

userSchema.virtual('myPosts', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'posts.owner',
  get: (res, _vir, user) => {
    if (res) return res.map(group => {
      const { _id: groupId } = group
      const myPostsArray = group.posts.filter(post => {
        return post.owner.equals(user._id)
      })
      return { posts: myPostsArray, groupId }
    })

  },
})

export default mongoose.model('User', userSchema)