import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})

const commentSchema = new mongoose.Schema({
  message: { type: String, maxlength: 500 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  likes: [likeSchema],
}, {
  timestamps: true,
})


const postSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 250 },
  message: { type: String, maxlength: 500 },
  tags: [{ type: String }],
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  likes: [likeSchema],
}, {
  timestamps: true,
})

export const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 50 },
  bio: { type: String, maxlength: 500 },
  image: { type: String },
  groupImage: { type: String },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  posts: [postSchema],
  members: [likeSchema],
})

// postSchema.virtual('groupId', {
//   ref: 'Group',
//   localField: '_id',
//   foreignField: 'posts._id',
//   get: (res) => {
//     if (res) console.log(res)
//   },
// })

export default mongoose.model('Group', groupSchema)