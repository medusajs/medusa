const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/discounts", () => {
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

  describe("POST /store/carts", () => {
    let regId;
    beforeEach(async () => {
      await adminSeeder(dbConnection);
      const manager = dbConnection.manager;
      const created = manager.create(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });
      const newReg = await manager.save(created);
      regId = newReg.id;
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a cart", async () => {
      const api = useApi();

      const getRes = await api.post(
        `/admin/discounts`,
        {
          code: "10DISC",
          rule: {
            description: "10 Percent",
            type: "percentage",
            allocation: "total",
            value: 10,
          },
          regions: [regId],
        },
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );
      expect(getRes.status).toEqual(200);

      fixtureWriter.addFixture("discount", getRes.data.discount);
      fixtureWriter.addFixture("discount_rule", getRes.data.discount.rule);
    });
  });
});
