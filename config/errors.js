export class NotFound extends Error {
  constructor(message){
    super(message)
    this.name = 'NotFound'
    this.status = 404
  }
}

export class Unauthorised extends Error {
  constructor(message){
    super(message)
    this.name = 'Unauthorised'
    this.message = message ? message : 'Unauthorised'
    this.status = 401
  }
}