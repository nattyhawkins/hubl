import { NotFound, Unauthorised } from './errors.js'
import { CastError } from 'mongoose'
// import Group from '../models/group.js'

export const sendErrors = (res, err) => {
  console.log(err)
  console.log('err message', err.message)
  console.log('err name', err.name)
  console.log('err status', err.status)
  if (err instanceof NotFound || err instanceof Unauthorised){
    return res.status(err.status).json({ message: err.message })
  } else if (err instanceof CastError){
    return res.status(400).json({ message: err.message })
  } else if (err.name === 'ValidationError'){
    return res.status(422).json({ message: err.errors ? err.errors : err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: err.message })
  } else {
    res.status(500).json({ message: err.message })
  }
}

export const findDocument = async (Model, idParam, req, res, populate) => {
  try {
    const { [idParam]: docId } = req.params
    let targetGroup = await Model.findById(docId)
    if (!targetGroup) throw new NotFound('Could not find group')
    if (populate) for (const item of populate){
      targetGroup = await targetGroup.populate(item)
    }
    return targetGroup
  } catch (err) {
    sendErrors(res, err)
  }
}
