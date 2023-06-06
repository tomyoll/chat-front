export default (to, router) => {
  if (localStorage.getItem('user')) {
    return true
  } else {
    return router.push('/login')
  }
}
