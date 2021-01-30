const path = require("path");
const express = require("express");
const { createDatabase, dropDatabase } = require("pg-god");
const getPort = require("get-port");

const { createConnection } = require("typeorm");
const { setApp } = require("../helpers/use-server");
const { setConnection } = require("../helpers/use-db");
const { setPort } = require("../helpers/use-api");

const loaders = require("@medusajs/medusa/dist/loaders").default;

const initialize = async () => {
  const databaseName = "medusa-integration";

  await createDatabase({ databaseName });

  const migrationDir = path.resolve(
    path.join(
      __dirname,
      `..`,
      `..`,
      `node_modules`,
      `@medusajs`,
      `medusa`,
      `dist`,
      `migrations`
    )
  );

  const connection = await createConnection({
    type: "postgres",
    url: "postgres://localhost/medusa-integration",
    migrations: [`${migrationDir}/*.js`],
    logging: true,
  });

  await connection.runMigrations();
  await connection.close();

  const app = express();

  const { dbConnection } = await loaders({
    directory: path.resolve(path.join(__dirname, ".")),
    expressApp: app,
  });

  const PORT = await getPort();

  return {
    db: dbConnection,
    app,
    port: PORT,
  };
};

const setup = async () => {
  const { db, app, port } = await initialize();

  setApp(app, port);
  setConnection(db);
  setPort(port);

  app.listen(port, (err) => {
    process.send(port);
  });
};

setup();
