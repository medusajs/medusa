const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const orderSeeder = require("../../helpers/order-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

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
    await dropDatabase({ databaseName: "medusa-integration" });

    medusaProcess.kill();
  });

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await orderSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "fulfillment"`);
      await manager.query(`DELETE FROM "swap"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "claim_image"`);
      await manager.query(`DELETE FROM "claim_tag"`);
      await manager.query(`DELETE FROM "claim_item"`);
      await manager.query(`DELETE FROM "claim_order"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "shipping_method"`);
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

    it("creates a cart", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/orders", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });
      expect(response.status).toEqual(200);
    });
  });

  describe("POST /admin/orders/:id/claims", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await orderSeeder(dbConnection);
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

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
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

      expect(response.data.order.claims[0].claim_items).toEqual([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          reason: "production_failure",
          images: [
            expect.objectContaining({
              url: "https://test.image.com",
            }),
          ],
          tags: [
            expect.objectContaining({
              value: "fluff",
            }),
          ],
        }),
      ]);

      expect(response.data.order.claims[0].additional_items).toEqual([
        expect.objectContaining({
          variant_id: "test-variant",
          quantity: 1,
        }),
      ]);
    });

    it("updates a claim", async () => {
      const api = useApi();

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
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

      const cid = response.data.order.claims[0].id;
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          shipping_methods: [
            {
              id: "test-method",
            },
          ],
        },
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
      );

      expect(status).toEqual(200);
      expect(updateData.order.claims[0].shipping_methods).toEqual([
        expect.objectContaining({
          id: "test-method",
        }),
      ]);
    });

    it("updates claim items", async () => {
      const api = useApi();

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
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

      let claim = response.data.order.claims[0];
      const cid = claim.id;
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          claim_items: claim.claim_items.map((i) => ({
            id: i.id,
            note: "Something new",
            images: [
              ...i.images.map((i) => ({ id: i.id })),
              { url: "https://new.com/image" },
            ],
            tags: [
              { value: "completely" },
              { value: "NEW" },
              { value: " tags" },
            ],
          })),
        },
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
      );

      expect(status).toEqual(200);
      expect(updateData.order.claims.length).toEqual(1);

      claim = updateData.order.claims[0];

      expect(claim.claim_items.length).toEqual(1);
      expect(claim.claim_items).toEqual([
        expect.objectContaining({
          id: claim.claim_items[0].id,
          reason: "production_failure",
          note: "Something new",
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "https://test.image.com",
            }),
            expect.objectContaining({
              url: "https://new.com/image",
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({ value: "completely" }),
            expect.objectContaining({ value: "new" }),
            expect.objectContaining({ value: "tags" }),
          ]),
        }),
      ]);
    });

    it("updates claim items - removes image", async () => {
      const api = useApi();

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
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

      let claim = response.data.order.claims[0];
      const cid = claim.id;
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          claim_items: claim.claim_items.map((i) => ({
            id: i.id,
            note: "Something new",
            images: [],
            tags: [
              { value: "completely" },
              { value: "NEW" },
              { value: " tags" },
            ],
          })),
        },
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
      );

      expect(status).toEqual(200);
      expect(updateData.order.claims.length).toEqual(1);

      claim = updateData.order.claims[0];

      expect(claim.claim_items.length).toEqual(1);
      expect(claim.claim_items).toEqual([
        expect.objectContaining({
          id: claim.claim_items[0].id,
          reason: "production_failure",
          note: "Something new",
          images: [],
          tags: expect.arrayContaining([
            expect.objectContaining({ value: "completely" }),
            expect.objectContaining({ value: "new" }),
            expect.objectContaining({ value: "tags" }),
          ]),
        }),
      ]);
    });

    it("fulfills a claim", async () => {
      const api = useApi();

      const response = await api
        .post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            shipping_methods: [
              {
                id: "test-method",
              },
            ],
            claim_items: [
              {
                item_id: "test-item",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
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

      const cid = response.data.order.claims[0].id;
      const fulRes = await api.post(
        `/admin/orders/test-order/claims/${cid}/fulfillments`,
        {},
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );
      expect(fulRes.status).toEqual(200);
      expect(fulRes.data.order.claims).toEqual([
        expect.objectContaining({
          id: cid,
          order_id: "test-order",
          fulfillment_status: "fulfilled",
        }),
      ]);

      const fid = fulRes.data.order.claims[0].fulfillments[0].id;
      const iid = fulRes.data.order.claims[0].additional_items[0].id;
      expect(fulRes.data.order.claims[0].fulfillments).toEqual([
        expect.objectContaining({
          items: [
            {
              fulfillment_id: fid,
              item_id: iid,
              quantity: 1,
            },
          ],
        }),
      ]);
    });
  });
});
