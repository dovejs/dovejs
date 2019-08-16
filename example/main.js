import Dove from '../src'
import config from './config'

const app = new Dove({ config })

app.start(() => {
  console.log(`Listening on ${app.config.port}`)
})
