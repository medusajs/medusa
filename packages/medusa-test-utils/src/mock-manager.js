export default {
  getRepository: function (repo) {
    return repo;
  },

  getCustomRepository: function (repo) {
    if (repo) {
      repo["metadata"] = repo["metadata"] ?? {
        columns: []
      }
    }
    return repo;
  },

  transaction: function (isolationOrCb, cb) {
    if (typeof isolationOrCb === "string") {
      return cb(this);
    } else {
      return isolationOrCb(this);
    }
  },
};
