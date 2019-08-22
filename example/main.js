import Dove from '../src'
import config from './config'

const app = new Dove({ config })

// 错误处理
app.on('error', (err, ctx) => {
  console.log('存在错误：')
  console.error(err)
})

app.start(() => {
  app.routes.forEach(e => {
    console.log(`[R]:${e.methods.join(',')} ${e.path} (${e.paths.join('/')}.${e.action})`)
  })
  console.log(`env: ${process.env.NODE_ENV}`)
  console.log(`Listening on ${app.config.port}`)
})
