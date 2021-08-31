const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb, useDb } = require("../../../helpers/use-db");

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
    const db = useDb();
    await db.shutdown();

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
      const db = useDb();
      await db.teardown();
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
          discountable: true,
          is_giftcard: false,
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

    it("creates a giftcard", async () => {
      const api = useApi();

      const payload = {
        title: "Test Giftcard",
        is_giftcard: true,
        description: "test-giftcard-description",
        options: [{ title: "Denominations" }],
        variants: [
          {
            title: "Test variant",
            prices: [{ currency_code: "usd", amount: 100 }],
            options: [{ value: "100" }],
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
          title: "Test Giftcard",
          discountable: false,
        })
      );
    });

    it("updates a product (update prices, tags, delete collection, delete type, replaces images)", async () => {
      const api = useApi();

      const payload = {
        collection_id: null,
        type: null,
        variants: [
          {
            id: "test-variant",
            prices: [{ currency_code: "usd", amount: 100, sale_amount: 75 }],
          },
        ],
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
          variants: [
            expect.objectContaining({
              prices: [
                expect.objectContaining({
                  sale_amount: 75,
                  amount: 100,
                }),
              ],
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
  describe("testing for soft-deletion + uniqueness on handles, collection and variant properties", () => {
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
      const db = useDb();
      await db.teardown();
    });

    it("successfully deletes a product", async () => {
      const api = useApi();

      const response = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data).toEqual(
        expect.objectContaining({
          id: "test-product",
          deleted: true,
        })
      );
    });

    it("successfully creates product with soft-deleted product handle", async () => {
      const api = useApi();

      // First we soft-delete the product
      const response = await api
        .delete("/admin/products/test-product", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.id).toEqual("test-product");

      // Lets try to create a product with same handle as deleted one
      const payload = {
        title: "Test product",
        handle: "test-product",
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

      const res = await api.post("/admin/products", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      });

      expect(res.status).toEqual(200);
      expect(res.data.product.handle).toEqual("test-product");
    });

    it("successfully deletes product collection", async () => {
      const api = useApi();

      // First we soft-delete the product collection
      const response = await api
        .delete("/admin/collections/test-collection", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.id).toEqual("test-collection");
    });

    it("successfully creates soft-deleted product collection", async () => {
      const api = useApi();

      const response = await api
        .delete("/admin/collections/test-collection", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.id).toEqual("test-collection");

      // Lets try to create a product collection with same handle as deleted one
      const payload = {
        title: "Another test collection",
        handle: "test-collection",
      };

      const res = await api.post("/admin/collections", payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      });

      expect(res.status).toEqual(200);
      expect(res.data.collection.handle).toEqual("test-collection");
    });

    it("successfully creates soft-deleted product variant", async () => {
      const api = useApi();

      const response = await api
        .delete("/admin/products/test-product/variants/test-variant", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.variant_id).toEqual("test-variant");

      // Lets try to create a product collection with same handle as deleted one
      const payload = {
        title: "Second variant",
        sku: "test-sku",
        ean: "test-ean",
        upc: "test-upc",
        barcode: "test-barcode",
        prices: [
          {
            currency_code: "usd",
            amount: 100,
          },
        ],
      };

      const res = await api.post(
        "/admin/products/test-product/variants",
        payload,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      );

      expect(res.status).toEqual(200);
      expect(res.data.product.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Second variant",
            sku: "test-sku",
            ean: "test-ean",
            upc: "test-upc",
            barcode: "test-barcode",
          }),
        ])
      );
    });
  });
});
