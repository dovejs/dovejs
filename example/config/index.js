import path from 'path'

export default {
  controller: {
    dir: path.resolve(__dirname, '../app/controller')
  },
  router: {
    perfix: '/api'
  }
}
