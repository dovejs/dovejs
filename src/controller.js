'use strict'

class Controller {
  constructor (app, ctx) {
    this.app = app
    this.context = ctx
  }

  set body (data) {
    this.context.body = data
  }
}

export default Controller
