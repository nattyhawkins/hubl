import { Unauthorised, NotFound } from '../config/errors.js'
import { findGroup, findPost, sendErrors, findComment } from '../config/helpers.js'
import Group from '../models/group.js'
import User from '../models/user.js'

//POST GROUP
export const addGroup = async (req, res) => {
  try {
    const newOwnedGroup = { ...req.body, owner: req.currentUser._id }
    const newGroup = await Group.create(newOwnedGroup)
    res.status(201).json(newGroup)
  } catch (err) {
    sendErrors(res, err)
  }
}

//GET ALL GROUPS
export const getAllGroups = async (req, res) => {
  try {
    let filteredGroups
    const allGroups = await Group.find({}).populate('owner')
    if (req.query.search) {
      filteredGroups = allGroups.filter(group => group.name.toLowerCase().includes(req.query.search.toLowerCase()))
    }
    const groupMap = filteredGroups && filteredGroups.length > 0 ? filteredGroups.map(group => group.name) : []
    const filter = groupMap.length > 0 ? { name: groupMap } : {}
    const groups = await Group.find(filter, null, { skip: req.query.skip, limit: req.query.limit }).populate('owner')
    return res.json(groups)
  } catch (err) {
    sendErrors(res, err)
  }
}

//GET 1 GROUP
// ? NEED TO ADD comments.owner TO POPULATE comment owners
export const getSingleGroup = async (req, res) => {
  try {
    const group = await findGroup(req, res, ['owner', 'posts.owner', 'posts.comments.owner'])
    return res.json(group)
  } catch (err) {
    sendErrors(res, err)
  }
}

export const updateGroup = async (req, res) => {
  try {
    const targetGroup = await findGroup(req, res)
    if (targetGroup && targetGroup.owner.equals(req.currentUser._id)) {
      Object.assign(targetGroup, req.body)
      targetGroup.save()
      return res.status(202).json(targetGroup)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}

export const deleteGroup = async (req, res) => {
  try {
    const targetGroup = await findGroup(req, res)
    if (targetGroup && targetGroup.owner.equals(req.currentUser._id)) {
      await targetGroup.remove()
      return res.sendStatus(204)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}

//Add post
export const addPost = async (req, res) => {
  try {
    const group = await findGroup(req, res, ['owner'])
    if (group) {
      const ownedPost = { ...req.body, owner: req.currentUser._id }
      group.posts.push(ownedPost)
      await group.save()
      return res.json(ownedPost)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}

//delete post
export const deletePost = async (req, res) => {
  try {
    //below returns an object
    const postObject = await findPost(req, res)
    const { post, group } = postObject
    if (post && post.owner.equals(req.currentUser._id)) {
      await post.remove()
      await group.save()
      return res.sendStatus(204)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}

// update post
export const updatePost = async (req, res) => {
  try {
    const postObject = await findPost(req, res)
    const { post, group } = postObject
    if (post && post.owner.equals(req.currentUser._id)) {
      Object.assign(post, req.body)
      group.save()
      return res.status(202).json(post)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}


export const addComment = async (req, res) => {
  try {
    const postObject = await findPost(req, res, ['owner'])
    const { post, group } = postObject
    if (post) {
      const ownedComment = { ...req.body, owner: req.currentUser._id }
      post.comments.push(ownedComment)
      await group.save()
      return res.json(ownedComment)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}


export const deleteComment = async (req, res) => {
  try {
    const commentObject = await findComment(req, res)
    const { comment, group } = commentObject
    if (!req.currentUser.equals(comment.owner)) throw new Unauthorised()
    await comment.remove()
    await group.save()
    return res.sendStatus(204)
  } catch (err) {
    sendErrors(res, err)
  }
}

export const updateComment = async (req, res) => {
  try {
    const commentObject = await findComment(req, res)
    const { comment, group } = commentObject
    if (comment && comment.owner.equals(req.currentUser._id)) {
      Object.assign(comment, req.body)
      group.save()
      return res.status(202).json(comment)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}

// handles both liking and unliking of post
export const likePost = async (req, res) => {
  try {
    const postObject = await findPost(req, res)
    const { post, group } = postObject
    if (post) {
      const existingLike = post.likes.find(like => like.owner.equals(req.currentUser._id))
      if (existingLike) {
        await existingLike.remove()
        await group.save()
        return res.sendStatus(204)
      }
      const ownedLike = { ...req.body, owner: req.currentUser._id }
      post.likes.push(ownedLike)
      await group.save()
      return res.json(ownedLike)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}

//handles both liking and unliking of comment depending if owner already exists in likes array
export const likeComment = async (req, res) => {
  try {
    const commentObject = await findComment(req, res)
    const { comment, group } = commentObject
    if (comment) {
      const existingLike = comment.likes.find(like => like.owner.equals(req.currentUser._id))
      if (existingLike) {
        await existingLike.remove()
        await group.save()
        return res.sendStatus(204)
      }
      const ownedLike = { ...req.body, owner: req.currentUser._id }
      comment.likes.push(ownedLike)
      await group.save()
      return res.json(ownedLike)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}


//profile
export const getProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId).populate(['myGroups', 'myPosts', 'joinedGroups']).populate({
      path: 'myPosts',
      populate: { path: 'posts.owner' },
    }).populate({
      path: 'myPosts',
      populate: { path: 'posts', populate: { path: 'comments.owner' } },
    })
    if (!targetUser) throw new NotFound('Uh oh, User not found!')
    return res.json(targetUser)
  } catch (err) {
    sendErrors(res, err)
  }
}
export const getMyProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.currentUser._id).populate(['myGroups', 'myPosts', 'joinedGroups']).populate({
      path: 'myPosts',
      populate: { path: 'posts.owner' },
    }).populate({
      path: 'myPosts',
      populate: { path: 'posts', populate: { path: 'comments.owner' } },
    })
    if (!targetUser) throw new NotFound('Uh oh, User not found! Are you logged in?')
    return res.json(targetUser)
  } catch (err) {
    sendErrors(res, err)
  }
}

export const joinGroup = async (req, res) => {
  try {
    const group = await findGroup(req, res)
    if (group) {
      const isMember = group.members.find(member => member.owner.equals(req.currentUser._id))
      if (isMember) {
        await isMember.remove()
        await group.save()
        return res.sendStatus(204)
      }
      const newMember = { ...req.body, owner: req.currentUser._id }
      group.members.push(newMember)
      await group.save()
      return res.json(newMember)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}

export const updateProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.currentUser._id)
    if (!targetUser) throw new NotFound('Uh oh, User not found!')
    Object.assign(targetUser, req.body)
    targetUser.save()
    return res.status(202).json(targetUser)
  } catch (err) {
    sendErrors(res, err)
  }
}
