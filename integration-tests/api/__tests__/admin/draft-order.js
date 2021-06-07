const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const draftOrderSeeder = require("../../helpers/draft-order-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/draft-orders", () => {
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

  describe("POST /admin/draft-orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
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
      await manager.query(`UPDATE "discount" SET rule_id=NULL`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`UPDATE "draft_order" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "draft_order"`);
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
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a draft order cart", async () => {
      const api = useApi();

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      };

      const response = await api
        .post("/admin/draft-orders", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);
    });

    it("creates a draft order with custom item", async () => {
      const api = useApi();

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
          {
            quantity: 1,
            metadata: {},
            unit_price: 10000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      };

      const response = await api
        .post("/admin/draft-orders", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);
    });

    it("creates a draft order with product variant with custom price and custom item price set to 0", async () => {
      const api = useApi();

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "TEST" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
            unit_price: 10000000,
          },
          {
            quantity: 2,
            metadata: {},
            unit_price: -1000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      };

      const response = await api
        .post("/admin/draft-orders", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      const created = await api
        .get(`/admin/draft-orders/${response.data.draft_order.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(created.data.draft_order.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            unit_price: 10000000,
          }),
          expect.objectContaining({
            unit_price: 0,
          }),
        ])
      );
      // Check that discount is applied
      expect(created.data.draft_order.cart.discounts[0]).toEqual(
        expect.objectContaining({
          code: "TEST",
        })
      );
    });

    it("creates a draft order with created shipping address", async () => {
      const api = useApi();

      const payload = {
        email: "oli@test.dk",
        shipping_address: {
          first_name: "new",
          last_name: "one",
          address_1: "New place 1",
          city: "Copenhagen",
          country_code: "us",
          postal_code: "2100",
        },
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
          {
            quantity: 1,
            metadata: {},
            unit_price: 10000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      };

      const response = await api
        .post("/admin/draft-orders", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);
    });

    it("creates a draft order and registers manual payment", async () => {
      const api = useApi();

      // register system payment for draft order
      const orderResponse = await api.post(
        `/admin/draft-orders/test-draft-order/pay`,
        {},
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      const createdOrder = await api.get(
        `/admin/orders/${orderResponse.data.order.id}`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      expect(orderResponse.status).toEqual(200);
      // expect newly created order to have id of draft order and system payment
      expect(createdOrder.data.order.draft_order_id).toEqual(
        "test-draft-order"
      );
      expect(createdOrder.data.order.payments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ provider_id: "system" }),
        ])
      );
      // expect draft order to be complete
      expect(updatedDraftOrder.data.draft_order.status).toEqual("completed");
      expect(updatedDraftOrder.data.draft_order.completed_at).not.toEqual(null);
    });
  });
  describe("GET /admin/draft-orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await draftOrderSeeder(dbConnection);
      } catch (err) {
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
      await manager.query(`UPDATE "discount" SET rule_id=NULL`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`UPDATE "draft_order" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "draft_order"`);
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
      await manager.query(`DELETE FROM "user"`);
    });

    it("lists draft orders", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/draft-orders", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.draft_orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "test-draft-order" }),
        ])
      );
    });

    it("lists draft orders with query", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/draft-orders?q=oli@test", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.draft_orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cart: expect.objectContaining({ email: "oli@test.dk" }),
          }),
        ])
      );
    });

    it("lists no draft orders on query for non-existing email", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/draft-orders?q=heyo@heyo.dk", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.draft_orders).toEqual([]);
      expect(response.data.count).toEqual(0);
    });
  });

  describe("DELETE /admin/draft-orders/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
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
      await manager.query(`UPDATE "discount" SET rule_id=NULL`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`UPDATE "draft_order" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "draft_order"`);
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
      await manager.query(`DELETE FROM "user"`);
    });

    it("deletes a draft order", async () => {
      const api = useApi();

      const response = await api
        .delete("/admin/draft-orders/test-draft-order", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data).toEqual({
        id: "test-draft-order",
        object: "draft-order",
        deleted: true,
      });
    });
  });

  describe("POST /admin/draft-orders/:id/line-items/:line_id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await draftOrderSeeder(dbConnection, { status: "open" });
      } catch (err) {
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
      await manager.query(`UPDATE "discount" SET rule_id=NULL`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`UPDATE "draft_order" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "draft_order"`);
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
      await manager.query(`DELETE FROM "user"`);
    });

    it("updates a line item on the draft order", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/draft-orders/test-draft-order/line-items/test-item",
          {
            title: "Update title",
            unit_price: 1000,
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

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      const item = updatedDraftOrder.data.draft_order.cart.items[0];

      expect(item.title).toEqual("Update title");
      expect(item.unit_price).toEqual(1000);
    });

    it("removes the line item, if quantity is 0", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/draft-orders/test-draft-order/line-items/test-item",
          {
            title: "Update title",
            quantity: 0,
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

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      const items = updatedDraftOrder.data.draft_order.cart.items;

      expect(items).toEqual([]);
    });
  });

  describe("POST /admin/draft-orders/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await draftOrderSeeder(dbConnection, { status: "open" });
      } catch (err) {
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
      await manager.query(`UPDATE "discount" SET rule_id=NULL`);
      await manager.query(`DELETE FROM "discount"`);
      await manager.query(`DELETE FROM "discount_rule"`);
      await manager.query(`DELETE FROM "payment_provider"`);
      await manager.query(`DELETE FROM "payment_session"`);
      await manager.query(`UPDATE "payment" SET order_id=NULL`);
      await manager.query(`UPDATE "draft_order" SET order_id=NULL`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "draft_order"`);
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
      await manager.query(`DELETE FROM "user"`);
    });

    it("updates a line item on the draft order", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/draft-orders/test-draft-order",
          {
            email: "lebron@james.com",
            billing_address: {
              first_name: "lebron",
              last_name: "james",
              address_1: "hollywood boulevard 1",
              city: "hollywood",
              country_code: "us",
              postal_code: "2100",
            },
            shipping_address: {
              first_name: "lebron",
              last_name: "james",
              address_1: "hollywood boulevard 1",
              city: "hollywood",
              country_code: "us",
              postal_code: "2100",
            },
            discounts: [{ code: "TEST" }],
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

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      const dorder = updatedDraftOrder.data.draft_order;

      expect(dorder.cart.email).toEqual("lebron@james.com");
      expect(dorder.cart.billing_address.first_name).toEqual("lebron");
      expect(dorder.cart.shipping_address.last_name).toEqual("james");
      expect(dorder.cart.discounts[0].code).toEqual("TEST");
    });
  });
});
