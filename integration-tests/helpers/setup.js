import path from "path";
import express from "express";
import { createDatabase, dropDatabase } from "pg-god";

import loaders from "@medusajs/medusa/dist/loaders";

export const initialize = async (dir) => {
  const databaseName = "medusa-integration";

  await createDatabase({ databaseName });

  const app = express();

  const { dbConnection } = await loaders({
    directory: dir,
    expressApp: app,
  });

  const PORT = await getPort();

  return {
    db: dbConnection,
    app,
    port: PORT,
  };
};
