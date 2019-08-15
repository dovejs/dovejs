'use strict'

class Application {
  constructor (options) {
    this.config = options.config

    this.initController()
  }

  initController () {
    this.controllers = []
  }
}

export default Application
