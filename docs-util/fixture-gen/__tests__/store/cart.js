const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const cartSeeder = require("../../helpers/cart-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/store/carts", () => {
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
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });
      await manager.query(
        `UPDATE "country" SET region_id='region' WHERE iso_2 = 'us'`
      );
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
    });

    it("creates a cart", async () => {
      const api = useApi();

      const response = await api.post("/store/carts");
      expect(response.status).toEqual(200);

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`);
      expect(getRes.status).toEqual(200);

      fixtureWriter.addFixture("cart", getRes.data.cart);
    });
  });
});
