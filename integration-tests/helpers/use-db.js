const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { dropDatabase, createDatabase } = require("pg-god");
const { createConnection } = require("typeorm");

const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost/medusa-integration`;
const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
};

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
    return dropDatabase({ databaseName }, pgGodCredentials);
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
    await createDatabase({ databaseName }, pgGodCredentials);

    const connection = await createConnection({
      type: "postgres",
      url: DB_URL,
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
      url: DB_URL,
      entities,
    });

    instance.setDb(dbConnection);
    return dbConnection;
  },
  useDb: function () {
    return instance;
  },
};
