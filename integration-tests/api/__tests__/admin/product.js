const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");
const productSeeder = require("../../helpers/product-seeder");

jest.setTimeout(30000);

describe("/admin/products", () => {
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

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection);
        await adminSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "product_option_value"`);
      await manager.query(`DELETE FROM "product_option"`);
      await manager.query(`DELETE FROM "image"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
      await manager.query(`DELETE FROM "product_collection"`);
      await manager.query(`DELETE FROM "product_tag"`);
      await manager.query(`DELETE FROM "product_type"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a product", async () => {
      const api = useApi();

      const payload = {
        title: "Test product",
        description: "test-product-description",
        type: { value: "test-type" },
        images: ["test-image.png", "test-image-2.png"],
        collection_id: "test-collection",
        tags: [{ value: "123" }, { value: "456" }],
        options: [{ title: "size" }, { title: "color" }],
        variants: [
          {
            title: "Test variant",
            inventory_quantity: 10,
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "large" }, { value: "green" }],
          },
        ],
      };

      const response = await api
        .post("/admin/products", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.product).toEqual(
        expect.objectContaining({
          title: "Test product",
          handle: "test-product",
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image.png",
            }),
            expect.objectContaining({
              url: "test-image-2.png",
            }),
          ]),
          thumbnail: "test-image.png",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
            expect.objectContaining({
              value: "456",
            }),
          ],
          type: expect.objectContaining({
            value: "test-type",
          }),
          collection: expect.objectContaining({
            id: "test-collection",
            title: "Test collection",
          }),
          options: [
            expect.objectContaining({
              title: "size",
            }),
            expect.objectContaining({
              title: "color",
            }),
          ],
          variants: [
            expect.objectContaining({
              title: "Test variant",
              prices: [
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 100,
                }),
              ],
              options: [
                expect.objectContaining({
                  value: "large",
                }),
                expect.objectContaining({
                  value: "green",
                }),
              ],
            }),
          ],
        })
      );
    });

    it("updates a product (update tags, delete collection, delete type, replaces images)", async () => {
      const api = useApi();

      const payload = {
        collection_id: null,
        type: null,
        tags: [{ value: "123" }],
        images: ["test-image-2.png"],
        type: { value: "test-type-2" },
      };

      const response = await api
        .post("/admin/products/test-product", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.product).toEqual(
        expect.objectContaining({
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image-2.png",
            }),
          ]),
          thumbnail: "test-image-2.png",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
          ],
          type: null,
          collection: null,
          type: expect.objectContaining({
            value: "test-type-2",
          }),
        })
      );
    });

    it("add option", async () => {
      const api = useApi();

      const payload = {
        title: "should_add",
      };

      const response = await api
        .post("/admin/products/test-product/options", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.product).toEqual(
        expect.objectContaining({
          options: [
            expect.objectContaining({
              title: "should_add",
              product_id: "test-product",
            }),
          ],
        })
      );
    });
  });
});
