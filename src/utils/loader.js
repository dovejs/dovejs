'use strict'
import path from 'path'
import fs from 'fs'

/**
 * 从文件夹里加载指定格式文件
 * @param {string} dir - 文件夹
 * @param {{ext: string[], ignore: RegExp[]}} options - 指定扩展文件
 * @reutrns {Array[]}
 * **/
export default function loader (dir, { ext = ['.js'], ignore = [] } = {}) {
  const files = fs.readdirSync(dir)

  return files.map(filename => {
    const filepath = path.resolve(dir, filename)
    const stat = fs.statSync(filepath)

    if (stat.isDirectory()) {
      return {
        name: filename,
        files: loader(filepath, ext)
      }
    }

    if (ext.length > 0 && ext.indexOf(path.extname(filename)) === -1) {
      return null
    }

    if (ignore.length > 0) {
      if (ignore.some(e => e.test(filepath))) return null
    }

    return {
      filename: filepath,
      name: path.basename(filename).replace(path.extname(filename), '')
    }
  }).filter(e => !!e)
}
