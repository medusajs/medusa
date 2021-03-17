const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region, GiftCard } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

jest.setTimeout(30000);

describe("/store/gift-cards", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    dbConnection.close();
    await dropDatabase({ databaseName: "medusa-integration" });

    medusaProcess.kill();
  });

  describe("GET /store/gift-cards/:code", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });
      await manager.insert(GiftCard, {
        id: "gift_test",
        code: "GC_TEST",
        value: 200,
        balance: 120,
        region_id: "region",
      });
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "gift_card"`);
      await manager.query(`DELETE FROM "region"`);
    });

    it("retrieves a gift card", async () => {
      const api = useApi();

      const response = await api.get("/store/gift-cards/GC_TEST");
      expect(response.status).toEqual(200);
      expect(response.data.gift_card).toEqual({
        id: "gift_test",
        code: "GC_TEST",
        value: 200,
        balance: 120,
        region: expect.any(Object),
      });
    });
  });
});
