export default {
  getRepository: function (repo) {
    return repo
  },

  withRepository: function (repo) {
    return repo
  },

  transaction: function (isolationOrCb, cb) {
    if (typeof isolationOrCb === "string") {
      return cb(this)
    } else {
      return isolationOrCb(this)
    }
  },
}
