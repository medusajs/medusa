const { dropDatabase } = require("pg-god");

afterAll(() => {
  dropDatabase({ databaseName: "medusa-integration" });
});
