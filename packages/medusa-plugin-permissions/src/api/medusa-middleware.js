// This middleware is injected to ensure authorization of requests
// Since this middleware uses the user object on the request, this should be
// injected after authentication in the core middleware, hence we name
// the middleware postAuth.
export default {
  preAuthentication: () => {
    console.log("pre")
    return (err, req, res, next) => {
      console.log(req)
      next()
    }
  },
  postAuthentication: () => {
    console.log("pst")
    return (err, req, res, next) => {
      const permissionService = req.scope.resolve("permissionService")
      if (permissionService.hasPermission(req.user, req.method, req.path)) {
        next()
      } else {
        res.status(422)
      }
    }
  }
}
