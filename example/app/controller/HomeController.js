import { Controller, Decorators } from '../../../src'

const { get, post, del } = Decorators.methods

// @Decorators.perfix('/home')
class HomeController extends Controller {
  @get('/')
  index (data) {
    console.log(data)
    this.body = 'Hi'
  }

  @get('/list')
  list ({ query: { id } }) {
    this.body = { ret: 0, msg: 'ok', id }
  }

  @get('/users')
  async users () {
    this.body = { ret: 0, msg: 'ok' }
  }

  @get('/users/:userId')
  async userInfo ({ params: { userId } }) {
    this.body = { ret: 0, msg: 'ok', result: { id: userId, name: 'admin' } }
  }

  @post('/create')
  async create () {
    // do
    this.body = { ret: 0, msg: 'ok' }
  }

  @del('/users/:userId')
  async delete (data) {
    console.log(data, await this.other())
    this.body = { ret: 0, msg: 'ok', method: this.context.method, reuslt: data }
  }

  async other (id) {
    return []
  }

  test () {}
}

export default HomeController
