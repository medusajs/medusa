export default {
  getCustomRepository: function (repo) {
    return repo;
  },

  transaction: function (cb) {
    return cb(this);
  },
};
