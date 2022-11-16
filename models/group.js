import mongoose from 'mongoose'


const commentSchema = new mongoose.Schema({
  message: { type: String, maxlength: 500 },
  tags: { type: String },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
})


const postSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 250 },
  message: { type: String, maxlength: 500 },
  tags: { type: String },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
}, {
  timestamps: true,
})

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 250 },
  bio: { type: String, maxlength: 500 },
  posts: [postSchema],
})