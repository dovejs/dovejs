import { Controller, Decorators } from '../../../src'

const { methods } = Decorators

class HomeController extends Controller {
  @methods.get('/')
  index () {}

  @methods.get('/list')
  list () {}
}

export default HomeController
