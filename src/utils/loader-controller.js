'use strict'
import camelcase from 'camelcase'
import loader from './loader'

/**
 * 从controller文件夹加载文件（递归加载）
 * @param {string} dir
 * @param {object} options
 * @returns {Array<{file, name, paths, value}>}
 * **/
function loaderController (dir, options = {}) {
  const files = loader(dir, options)
  const arr = []

  function load (files, paths = []) {
    for (const i in files) {
      const item = files[i]
      const filename = camelcase(item.name)
      const cpaths = [].concat(paths, [filename])

      if (item.files && item.files.length > 0) {
        load(item.files, cpaths)
      } else {
        arr.push({
          ...item,
          paths: cpaths,
          value: require(item.filename).default
        })
      }
    }
  }

  load(files)

  return arr
}

export default loaderController
