const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb, useDb } = require("../../../helpers/use-db");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/gift-cards", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    const db = useDb();
    await db.shutdown();

    medusaProcess.kill();
  });

  describe("POST /admin/gift-cards", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      try {
        await adminSeeder(dbConnection);
        await manager.insert(Region, {
          id: "region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const db = useDb();
      await db.teardown();
    });

    it("creates a gift card", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/gift-cards",
          {
            value: 1000,
            region_id: "region",
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.gift_card.value).toEqual(1000);
      expect(response.data.gift_card.balance).toEqual(1000);
      expect(response.data.gift_card.region_id).toEqual("region");
    });
  });
});
