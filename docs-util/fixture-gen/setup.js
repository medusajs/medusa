const fixtureWriter = require("./utils/write-fixture").default;
const { dropDatabase } = require("pg-god");

beforeAll(() => {
  console.log(fixtureWriter);
});

afterAll(async () => {
  console.log(fixtureWriter);
  await dropDatabase({ databaseName: "medusa-fixtures" });
  await fixtureWriter.execute();
});
