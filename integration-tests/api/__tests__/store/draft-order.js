const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const draftOrderSeeder = require("../../helpers/draft-order-seeder");
const { create } = require("domain");

jest.setTimeout(30000);

describe("/store/carts (draft-orders)", () => {
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

  describe("POST /admin/draft-order", () => {
    beforeEach(async () => {
      try {
        await draftOrderSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "draft_order"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "payment"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(`DELETE FROM "address"`);

      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'de'`
      );
      await manager.query(`DELETE FROM "region"`);
    });

    it("completes a cart for a draft order thereby creating an order for the draft order", async () => {
      const api = useApi();

      const response = await api
        .post("/store/carts/test-cart/complete-cart", {})
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      const createdOrder = await api
        .get(`/store/orders/${response.data.data.id}`, {})
        .catch((err) => {
          console.log(err);
        });

      expect(createdOrder.data.order.cart_id).toEqual("test-cart");
    });
  });
});
