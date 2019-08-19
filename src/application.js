'use strict'
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import favicon from 'koa-favicon'
import session from 'koa-session'
import compress from 'koa-compress'
import mount from 'koa-mount'
import KoaStatic from 'koa-static'
import loaderController from './utils/loader-controller'
import Controller from './controller'
import { actionWrapper, pathJoin } from './utils'
import logger from './middleware/request-log'

class Application extends Koa {
  constructor (options) {
    super()

    this.config = options.config
    this.config.port = this.config.port || 4000
    this.router = null
    this.controllers = []

    this.keys = this.config.keys || []

    this.initialize()
  }

  initialize () {
    this.initMiddlewares()

    const perfix = (this.config.router && this.config.router.perfix) || '/'
    this.router = new Router({ prefix: perfix })
    this.loaderController()
    this.registerRouter()
  }

  initMiddlewares () {
    // logger
    this.use(logger(this.config.logger || {}))

    // gzip
    if (this.config.gzip) {
      this.use(compress(typeof this.config.gzip === 'object' ? this.config.gzip : {
        filter: function (contentType) {
          return /(html|javascript|image|css)/i.test(contentType)
        },
        threshold: 1024,
        flush: require('zlib').Z_SYNC_FLUSH
      }))
    }

    // favicon
    if (this.config.favicon) {
      this.use(favicon(this.config.favicon))
    }

    // static
    if (this.config.public) {
      const staticConfig = this.config.public

      if (typeof staticConfig !== 'object') throw new Error('config.public must be an object or array')

      if (Array.isArray(staticConfig)) {
        for (const i in staticConfig) {
          this.use(mount(staticConfig[i].publicPath, KoaStatic(staticConfig[i].dir, staticConfig[i].config)))
        }
      } else {
        this.use(mount(staticConfig.publicPath, KoaStatic(staticConfig.dir, staticConfig.config)))
      }
    }

    // session
    if (this.config.session) {
      this.use(session(this.config.session || {}, this))
    }

    // bodyparser
    this.use(bodyparser(this.config.bodyparser))

    // 加载用户中间件
    if (this.config.middleware && Array.isArray(this.config.middleware)) {
      for (const i in this.config.middleware) {
        const middleware = this.config.middleware[i](this)

        if (typeof middleware !== 'function') throw new Error('middleware must be a function')

        this.use(middleware)
      }
    }
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
