const fixtureWriter = require("./fixture-gen/utils/write-fixture").default;
const { dropDatabase } = require("pg-god");

afterAll(async () => {
  await dropDatabase({ databaseName: "medusa-fixtures" });
  await fixtureWriter.execute();
});
