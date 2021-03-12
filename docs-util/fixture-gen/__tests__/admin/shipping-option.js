const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/shipping-options", () => {
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

  describe("POST /admin/shipping-options", () => {
    let regId;
    beforeEach(async () => {
      await adminSeeder(dbConnection);
      const manager = dbConnection.manager;
      const created = manager.create(Region, {
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
        fulfillment_providers: [
          {
            id: "test-ful",
          },
        ],
      });
      const newReg = await manager.save(created);
      regId = newReg.id;
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a cart", async () => {
      const api = useApi();

      const getRes = await api.post(
        `/admin/shipping-options`,
        {
          name: "Free Shipping",
          region_id: regId,
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 100,
        },
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );
      expect(getRes.status).toEqual(200);

      fixtureWriter.addFixture("region", getRes.data.shipping_option.region);
      fixtureWriter.addFixture("shipping_option", getRes.data.shipping_option);
      fixtureWriter.addFixture(
        "shipping_profile",
        getRes.data.shipping_option.shipping_profile
      );
    });
  });
});
