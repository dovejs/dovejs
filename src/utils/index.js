'use strict'

export const actionWrapper = (Controller, action, app) => {
  return async function (ctx, next) {
    try {
      const controller = new Controller(app, ctx)
      await controller[action](controller, [
        {
          query: ctx.query,
          params: ctx.params,
          body: ctx.body
        }
      ])
    } catch (err) {
      app.emit('error', err, ctx)
    }
  }
}

export function pathJoin () {
  if (arguments.length <= 1) return arguments[0]

  const paths = [arguments[0]]
  for (let i = 1; i < arguments.length; i++) {
    paths.push(arguments[i].replace(/^\/+/, ''))
  }

  return paths.join('/')
}
