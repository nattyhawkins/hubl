import express from 'express'
import { addGroup, addPost, deleteGroup, deletePost, getAllGroups, getSingleGroup, updateGroup } from '../controllers/groups.js'
import { loginUser, registerUser } from '../controllers/auth.js'
import secureRoute from './secureRoute.js'


const router = express.Router()

router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)

router.route('/groups')
  .get(getAllGroups)
  .post(secureRoute, addGroup)

router.route('/groups/:groupId')
  .get(getSingleGroup)
  .put(secureRoute, updateGroup)
  .delete(secureRoute, deleteGroup)

router.route('/groups/:groupId/posts')
  .post(secureRoute, addPost)

router.route('/groups/:groupId/posts/:postId')
//   .get(getSinglePost)
//   .put(secureRoute, updatePost)
  .delete(secureRoute, deletePost)

// router.route('/groups/:groupId/posts/:postId/comments')
//   .post(secureRoute, addComments)

// router.route('/groups/:groupId/posts/:postId/comments/:commentId')
//   .delete(secureRoute, deleteComments)

// router.route('/profile')
//   .get(secureRoute, getProfile)






export default router
