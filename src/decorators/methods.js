'use strict'

export const method = (methods, path, name) => {
  return function (target, key) {
    const route = {
      methods: Array.isArray(methods)
        ? methods.map(e => e.toLocaleUpperCase())
        : methods.split(',').map(e => e.toLocaleUpperCase()),
      path,
      name
    }
    Reflect.defineMetadata(key, route, target)
  }
}

export const get = (path, name) => {
  return method('GET', path, name)
}

export const post = (path, name) => {
  return method('POST', path, name)
}

export const put = (path, name) => {
  return method('PUT', path, name)
}

export const del = (path, name) => {
  return method('DELETE', path, name)
}

export const head = (path, name) => {
  return method('HEAD', path, name)
}

export const patch = (path, name) => {
  return method('PATCH', path, name)
}

export const options = (path, name) => {
  return method('OPTIONS', path, name)
}

export const all = (path, name) => {
  return method('ALL', path, name)
}
