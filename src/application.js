'use strict'
import Koa from 'koa'
import Router from 'koa-router'
import loaderController from './utils/loader-controller'
import Controller from './controller'

class Application extends Koa {
  constructor (options) {
    super()

    this.config = options.config
    this.config.port = this.config.port || 4000
    this.router = null
    this.controllers = []
    console.log(this.config)
    this.initialize()
  }

  initialize () {
    const perfix = (this.config.router && this.config.router.perfix) || '/'
    this.router = new Router({ prefix: perfix })
    this.loaderController()
    this.registerRouter()
  }

  loaderController () {
    const { dir, extname = ['.js'], ignore } = this.config.controller
    const modules = loaderController(dir, { ext: extname, ignore })
    const controllers = {}
    const routes = []

    for (const i in modules) {
      const { filename, paths, value } = modules[i]

      // 必须继承 Controller
      if (!(value.prototype instanceof Controller)) {
        throw new Error(`Contoller must be inherit to 'Contoller' on file: ${filename}`)
      }

      const key = paths.join('/')

      controllers[key] = value
      const actions = Object.getOwnPropertyNames(value.prototype)

      for (const i in actions) {
        const action = actions[i]

        if (action === 'constructor') continue

        const route = Reflect.getMetadata(action, value.prototype)

        console.log(action, route)
        routes.push({ ...route, paths })
        this.router.register(route.path, route.methods, (ctx) => {
          ctx.body = route
        })
      }
    }

    this.controllers = controllers
    this.routes = routes
    console.log(routes)
  }

  registerRouter () {
    this.use(this.router.routes())
      .use(this.router.allowedMethods())
  }

  start (cb) {
    this.listen(this.config.port, cb)
  }
}

export default Application
