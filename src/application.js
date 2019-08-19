'use strict'
import Koa from 'koa'
import Router from 'koa-router'
import loaderController from './utils/loader-controller'
import Controller from './controller'
import { actionWrapper, pathJoin } from './utils'

class Application extends Koa {
  constructor (options) {
    super()

    this.config = options.config
    this.config.port = this.config.port || 4000
    this.router = null
    this.controllers = []

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
      const controllerName = paths[paths.length - 1].replace(/controller/i, '')
      const actions = Object.getOwnPropertyNames(value.prototype)
      const routerPerfix = Reflect.getMetadata('ROUTER_PERFIX', value)

      controllers[key] = value

      for (const i in actions) {
        const action = actions[i]

        if (action === 'constructor') continue

        const route = Reflect.getMetadata(action, value.prototype)

        if (!route) continue // 未使用methods装饰器的不做处理

        // 定义了路由前缀
        if (routerPerfix) {
          route.path = pathJoin(routerPerfix, route.path)
        }

        routes.push({ ...route, paths, action, controller: controllerName })

        this.router.register(route.path, route.methods, actionWrapper(value, action, this))
      }
    }

    this.controllers = controllers
    this.routes = routes
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
