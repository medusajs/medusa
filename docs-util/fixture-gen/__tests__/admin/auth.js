const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/admin/auth", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    await dbConnection.close();
    await dropDatabase({ databaseName: "medusa-fixtures" });

    medusaProcess.kill();
  });

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "user"`);
    });

    it("authenticates user", async () => {
      const api = useApi();

      const response = await api
        .post("/admin/auth", {
          email: "admin@medusa.js",
          password: "secret_password",
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);

      fixtureWriter.addFixture("user", response.data.user);
    });
  });
});
