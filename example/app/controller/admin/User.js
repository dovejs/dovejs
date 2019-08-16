import { Controller, Decorators } from '../../../../src'

const { methods } = Decorators

class UserController extends Controller {
  @methods.get('/users/list')
  userList () {}
}

export default UserController
