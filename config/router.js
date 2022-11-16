import express from 'express'
import { registerUser } from '../controllers/auth.js'


const router = express.Router()

router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)

// router.route('/groups')
//   .get(getAllGroups)
//   .post(secureRoute, addGroup)

// router.route('/groups/:groupName')
//   .get(getSingleGroup)
//   .put(secureRoute, updateGroup)
//   .delete(secureRoute, deleteGroup)

// router.route('/groups/:groupName/posts')
//   .get(getAllPosts)
//   .post(secureRoute, addPost)

// router.route('/groups/:groupName/posts/:postId')
//   .get(getSinglePost)
//   .put(secureRoute, updatePost)
//   .delete(secureRoute, deletePost)

// router.route('/groups/:groupName/posts/:postId/comments')
//   .post(secureRoute, addComments)

// router.route('/groups/:groupName/posts/:postId/comments/:commentsId')
//   .delete(secureRoute, deleteComments)



// router.route('/profile')
//   .get(secureRoute, getProfile)






export default router
