const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const orderSeeder = require("../../helpers/order-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

jest.setTimeout(30000);

describe("/admin/orders", () => {
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

  describe("GET /admin/orders/:id", () => {
    let id;
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        const order = await orderSeeder(dbConnection);
        id = order.id;
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "fulfillment_item"`);
      await manager.query(`DELETE FROM "fulfillment"`);
      await manager.query(`DELETE FROM "swap"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "claim_image"`);
      await manager.query(`DELETE FROM "claim_tag"`);
      await manager.query(`DELETE FROM "claim_item"`);
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "claim_order"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_option_value"`);
      await manager.query(`DELETE FROM "product_option"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "payment"`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a claim", async () => {
      const api = useApi();

      const response = await api.get(`/admin/orders/${id}`, {
        headers: {
          authorization: "Bearer test_token",
        },
      });
      expect(response.status).toEqual(200);

      fixtureWriter.addFixture("order", response.data.order);
    });
  });

  describe("POST /admin/orders/:id/returns", () => {
    let id;
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        const order = await orderSeeder(dbConnection);
        id = order.id;
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "fulfillment_item"`);
      await manager.query(`DELETE FROM "fulfillment"`);
      await manager.query(`DELETE FROM "swap"`);
      await manager.query(`DELETE FROM "return_item"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "claim_image"`);
      await manager.query(`DELETE FROM "claim_tag"`);
      await manager.query(`DELETE FROM "claim_item"`);
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "claim_order"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_option_value"`);
      await manager.query(`DELETE FROM "product_option"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "payment"`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a return", async () => {
      const api = useApi();

      const { data } = await api.get(`/admin/orders/${id}`, {
        headers: {
          authorization: "Bearer test_token",
        },
      });
      const order = data.order;

      const response = await api.post(
        `/admin/orders/${id}/return`,
        {
          items: [
            {
              item_id: order.items[0].id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      );
      expect(response.status).toEqual(200);

      fixtureWriter.addFixture("return", response.data.order.returns[0]);
    });
  });
});
