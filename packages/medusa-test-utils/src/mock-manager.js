export default {
  connection: {
    getMetadata: (target) => {

      return target["metadata"] ?? {
        columns: []
      }
    }
  },

  getRepository: function (repo) {
    return repo
  },

  withRepository: function (repo) {
    return Object.assign(repo, { manager: this })
  },

  transaction: function (isolationOrCb, cb) {
    if (typeof isolationOrCb === "string") {
      return cb(this)
    } else {
      return isolationOrCb(this)
    }
  },
}
