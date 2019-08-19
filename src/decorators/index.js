'use strict'
import * as methods from './methods'

const perfix = (perfix = '') => {
  return function (target) {
    Reflect.defineMetadata('ROUTER_PERFIX', perfix, target)
  }
}

export default {
  methods,
  perfix: perfix
}
