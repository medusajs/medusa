const { dropDatabase, createDatabase } = require("pg-god");
const { createConnection } = require("typeorm");

const path = require("path");

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
  initDb: async function ({ cwd }) {
    const migrationDir = path.resolve(
      path.join(
        cwd,
        `node_modules`,
        `@medusajs`,
        `medusa`,
        `dist`,
        `migrations`
      )
    );

    const databaseName = "medusa-integration";
    await createDatabase({ databaseName });

    const connection = await createConnection({
      type: "postgres",
      url: "postgres://localhost/medusa-integration",
      migrations: [`${migrationDir}/*.js`],
    });

    await connection.runMigrations();
    await connection.close();

    const modelsLoader = require(path.join(
      cwd,
      `node_modules`,
      `@medusajs`,
      `medusa`,
      `dist`,
      `loaders`,
      `models`
    )).default;

    const entities = modelsLoader({}, { register: false });
    const dbConnection = await createConnection({
      type: "postgres",
      url: "postgres://localhost/medusa-integration",
      entities,
    });

    instance.setDb(dbConnection);
    return dbConnection;
  },
  useDb: function () {
    return instance;
  },
};
