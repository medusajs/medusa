const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/shipping-profiles", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    dbConnection.close();
    await dropDatabase({ databaseName: "medusa-fixtures" });

    medusaProcess.kill();
  });

  describe("GET /admin/store", () => {
    let regId;
    beforeEach(async () => {
      await adminSeeder(dbConnection);
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a cart", async () => {
      const api = useApi();

      const getRes = await api.get(`/admin/store`, {
        headers: {
          Authorization: "Bearer test_token",
        },
      });
      expect(getRes.status).toEqual(200);

      fixtureWriter.addFixture("store", getRes.data.store);
    });
  });
});
