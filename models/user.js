import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

//define registration schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

userSchema
  .virtual('passwordConfirmation')
  .set(function(fieldValue){
    this._passwordConfirmation = fieldValue
  })

userSchema.set('toJSON', {
  transform(_doc, json){
    delete json.password
    return json
  },
})

//check password match - custom pre validation
userSchema
  .pre('validate', function(next){
    if (this.isModified('password') && this._passwordConfirmation !== this.password){
      this.invalidate('passwordConfirmation', 'Passwords do not match')
    }
    next()
  })

userSchema
  .pre('save', function(next){
    if (this.isModified('password')){
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12))
    }
    next()
  })

userSchema.methods.validatePassword = function (plainTextPassword) {
  return bcrypt.compareSync(plainTextPassword, this.password)
}

export default mongoose.model('User', userSchema)