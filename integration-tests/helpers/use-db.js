const { dropDatabase } = require("pg-god");

const DbTestUtil = {
  db_: null,

  setDb: function (connection) {
    this.db_ = connection;
  },

  clear: function () {
    return this.db_.synchronize(true);
  },

  shutdown: async function () {
    await this.db_.close();
    return dropDatabase({ databaseName });
  },
};

const instance = DbTestUtil;

module.exports = {
  setConnection: function (conn) {
    instance.setDb(conn);
    return instance;
  },
  useDb: function () {
    return instance;
  },
};
