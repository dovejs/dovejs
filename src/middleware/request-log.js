'use strict'
import chalk from 'chalk'
import { format } from '../utils'

export default function logger ({ isDev = true, stream = process.stdout }) {
  return async function (ctx, next) {
    if (ctx.path === '/favicon.ico') {
      await next()
      return
    }

    if (!isDev) {
      await next()
      return
    }

    const start = new Date()
    await next()
    const time = Date.now() - start.getTime()
    const log = stream

    let method = ''

    switch (ctx.method) {
      case 'GET':
        method = chalk.green.bold('GET')
        break
      case 'POST':
        method = chalk.yellow.bold('POST')
        break
      case 'PUT':
        method = chalk.blue.bold('PUT')
        break
      case 'DELETE':
        method = chalk.red.bold('DEL')
        break
      default:
        method = chalk.gray.bold(ctx.method)
    }

    let status = ''

    switch (ctx.status) {
      case 200:
        status = chalk.green('200')
        break
      case 304:
        status = chalk.blue('304')
        break
      case 404:
        status = chalk.yellow('404')
        break
      default:
        status = chalk.red(ctx.status + '')
    }

    log.write(`[${format(start, 'HH:mm:ss.SSS')}] ${method} ${ctx.url} ${status} - ${chalk.greenBright(time + 'ms')} \n`)
  }
}
