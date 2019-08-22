export default app => {
  return async function (ctx, next) {
    // console.log('demo middleware')
    await next()
  }
}
