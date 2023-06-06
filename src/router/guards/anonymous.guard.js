export default (to, router) => {
  if (localStorage.getItem('user')) {
    return router.push('/')
  }

  return true
}
