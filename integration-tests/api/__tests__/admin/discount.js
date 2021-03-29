const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region, DiscountRule, Discount } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/discounts", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    await dbConnection.close();
    await dropDatabase({ databaseName: "medusa-integration" });

    medusaProcess.kill();
  });

  describe("POST /admin/discounts/:discount_id/dynamic-codes", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      try {
        await adminSeeder(dbConnection);
        await manager.insert(DiscountRule, {
          id: "test-discount-rule",
          description: "Dynamic rule",
          type: "percentage",
          value: 10,
          allocation: "total",
        });
        await manager.insert(Discount, {
          id: "test-discount",
          code: "DYNAMIC",
          is_dynamic: true,
          is_disabled: false,
          rule_id: "test-discount-rule",
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a dynamic discount", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/discounts/test-discount/dynamic-codes",
          {
            code: "HELLOWORLD",
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
    });
  });
});
