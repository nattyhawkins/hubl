export class NotFound extends Error {
  constructor(message){
    super(message)
    this.name = 'NotFound'
    this.message = message ? message : 'Not Found'
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

export class CharacterLimit extends Error {
  constructor(message){
    super(message)
    this.name = 'CharacterLimit'
    this.message = message ? message : 'Character limit exceeded'
    this.status = 400
  }
}