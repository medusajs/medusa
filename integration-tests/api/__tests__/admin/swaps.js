const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const orderSeeder = require("../../helpers/order-seeder");
const swapSeeder = require("../../helpers/swap-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/swaps", () => {
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

  describe("GET /admin/swaps/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await orderSeeder(dbConnection);
        await swapSeeder(dbConnection);
      } catch (err) {
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "return_item"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "payment"`);
      await manager.query(`DELETE FROM "swap"`);
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("gets a swap with cart and totals", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/swaps/test-swap", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);
      expect(response.data.swap).toEqual(
        expect.objectContaining({
          id: "test-swap",
        })
      );

      expect(response.data.swap.cart).toEqual(
        expect.objectContaining({
          id: "test-cart",
          shipping_total: 1000,
          subtotal: 1000,
          total: 2000,
        })
      );
      expect(response.data.swap.cart).toHaveProperty("discount_total");
      expect(response.data.swap.cart).toHaveProperty("gift_card_total");
    });
  });

  describe("GET /admin/swaps/", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await orderSeeder(dbConnection);
        await swapSeeder(dbConnection);
      } catch (err) {
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "return_item"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "payment"`);
      await manager.query(`DELETE FROM "swap"`);
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("lists all swaps", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/swaps/", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty("count");
      expect(response.data.offset).toBe(0);
      expect(response.data.limit).toBe(50);
      expect(response.data.swaps).toContainEqual(
        expect.objectContaining({
          id: "test-swap",
        })
      );
    });
  });
});
