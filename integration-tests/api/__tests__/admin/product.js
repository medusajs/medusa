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

  describe("POST /admin/products/import", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection);
        await adminSeeder(dbConnection);
      } catch (err) {
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "product_option_value"`);
      await manager.query(`DELETE FROM "product_option"`);
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

    it("imports products (update product, upsert variants)", async () => {
      const api = useApi();

      const payload = [
        {
          title: "Test product two",
          handle: "test-product-two",
          description: "test-product-description",
          images: ["test-image.png", "test-image-2.png"],
          type: "test-type",
          collection: "Album",
          tags: ["123", "456"],
          options: [{ title: "size" }, { title: "color" }],
          variants: [
            {
              title: "Test variant updated",
              inventory_quantity: 10,
              prices: [{ currency_code: "usd", amount: 100 }],
              options: [{ value: "large" }, { value: "green" }],
            },
          ],
        },
      ];

      const response = await api
        .post(
          "/admin/products/import",
          { products: payload },
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
      expect(response.data.products.length).toEqual(1);

      const productId = response.data.products[0];

      const createdProduct = await api
        .get(`/admin/products/${productId}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .then(({ data }) => data.product)
        .catch((err) => console.log(err));

      expect(createdProduct).toEqual(
        expect.objectContaining({
          title: "Test product two",
          handle: "test-product-two",
          thumbnail: "test-image.png",
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image.png",
            }),
            expect.objectContaining({
              url: "test-image-2.png",
            }),
          ]),
          tags: [
            expect.objectContaining({
              value: "123",
            }),
            expect.objectContaining({
              value: "456",
            }),
          ],
          type_id: "test-type",
          collection: expect.objectContaining({ title: "Album" }),
          options: [
            expect.objectContaining({
              title: "size",
            }),
            expect.objectContaining({
              title: "color",
            }),
          ],
          variants: expect.arrayContaining([
            expect.objectContaining({
              title: "Test variant updated",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 100,
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "large",
                }),
                expect.objectContaining({
                  value: "green",
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it("imports products (insert product, insert variants)", async () => {
      const api = useApi();

      const payload = [
        {
          title: "Watch the throne",
          handle: "watch-the-throne",
          description: "",
          type: "GOAT",
          collection: "Album",
          tags: ["123", "456"],
          options: [{ title: "Default value" }],
          variants: [
            {
              title: "V1",
              inventory_quantity: 100,
              prices: [{ currency_code: "usd", amount: 10000 }],
              options: [{ value: "Default variant" }],
            },
          ],
        },
        {
          title: "Watch the throne 2",
          handle: "watch-the-throne-2",
          description: "",
          collection: "Album",
          type: "GOAT",
          tags: ["123", "456"],
          options: [{ title: "Default value" }],
          variants: [
            {
              title: "2-V1",
              inventory_quantity: 100,
              prices: [{ currency_code: "usd", amount: 10000 }],
              options: [{ value: "Default variant" }],
            },
          ],
        },
      ];

      const response = await api
        .post(
          "/admin/products/import",
          { products: payload },
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
      expect(response.data.products.length).toEqual(2);

      const productId = response.data.products[0];

      const createdProduct = await api
        .get(`/admin/products/${productId}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .then(({ data }) => data.product)
        .catch((err) => console.log(err));

      expect(createdProduct).toEqual(
        expect.objectContaining({
          title: "Watch the throne",
          handle: "watch-the-throne",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
            expect.objectContaining({
              value: "456",
            }),
          ],
          type: expect.objectContaining({ value: "GOAT" }),
          collection: expect.objectContaining({ title: "Album" }),
          options: [
            expect.objectContaining({
              title: "Default value",
            }),
          ],
          variants: expect.arrayContaining([
            expect.objectContaining({
              title: "V1",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 10000,
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "Default variant",
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it("imports products (update product, update variants)", async () => {
      const api = useApi();

      const payload = [
        {
          title: "Test product two",
          handle: "test-product-two",
          description: "This product has been updated through import",
          type: "test-type",
          collection: "test-collection",
          tags: ["123", "456"],
          options: [{ title: "Default value" }],
          variants: [
            {
              title: "Test variant, but updated",
              prices: [
                { currency_code: "usd", amount: 400 },
                { currency_code: "dkk", amount: 10000 },
              ],
              options: [{ value: "Default variant" }],
            },
          ],
        },
        {
          title: "Watch the throne",
          handle: "watch-the-throne",
          description: "",
          type: "GOAT",
          collection: "Album",
          tags: ["123", "456"],
          options: [{ title: "Default value" }],
          variants: [
            {
              title: "V1",
              inventory_quantity: 100,
              prices: [{ currency_code: "usd", amount: 10000 }],
              options: [{ value: "Default variant" }],
            },
          ],
        },
      ];

      const response = await api
        .post(
          "/admin/products/import",
          { products: payload },
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
      expect(response.data.products.length).toEqual(2);

      const productId = response.data.products[0];

      const createdProduct = await api
        .get(`/admin/products/${productId}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .then(({ data }) => data.product)
        .catch((err) => console.log(err));

      expect(createdProduct).toEqual(
        expect.objectContaining({
          title: "Test product two",
          handle: "test-product-two",
          description: "This product has been updated through import",
          tags: [
            expect.objectContaining({
              value: "123",
            }),
            expect.objectContaining({
              value: "456",
            }),
          ],
          type_id: "test-type",
          collection: expect.objectContaining({ title: "test-collection" }),
          options: [
            expect.objectContaining({
              title: "Default value",
            }),
          ],
          variants: expect.arrayContaining([
            expect.objectContaining({
              title: "Test variant, but updated",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 400,
                }),
                expect.objectContaining({
                  currency_code: "dkk",
                  amount: 10000,
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it("fails import if options on product and variant differ", async () => {
      const api = useApi();

      const payload = [
        {
          title: "Watch the throne",
          handle: "watch-the-throne",
          description: "",
          options: [{ title: "size" }, { title: "color" }],
          variants: [
            {
              title: "V1",
              inventory_quantity: 100,
              prices: [{ currency_code: "usd", amount: 10000 }],
              options: [{ value: "Default variant" }],
            },
          ],
        },
      ];

      try {
        await api.post(
          "/admin/products/import",
          { products: payload },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        );
      } catch (error) {
        expect(error.response.status).toEqual(400);
      }
    });

    it("fails import if product handle is missing", async () => {
      const api = useApi();

      const payload = [
        {
          title: "Watch the throne",
          description: "",
          options: [{ title: "Default value" }],
          variants: [
            {
              title: "V1",
              inventory_quantity: 100,
              prices: [{ currency_code: "usd", amount: 10000 }],
              options: [{ value: "Default variant" }],
            },
          ],
        },
      ];

      try {
        await api.post(
          "/admin/products/import",
          { products: payload },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        );
      } catch (error) {
        expect(error.response.status).toEqual(400);
      }
    });
  });
});
