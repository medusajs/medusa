const { dropDatabase } = require("pg-god");
const path = require("path");
const {
  Region,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  ShippingOption,
  LineItem,
} = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

jest.setTimeout(30000);

describe("/store/carts", () => {
  let medusaProcess;
  let dbConnection;

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."));
    dbConnection = await initDb({ cwd });
    medusaProcess = await setupServer({ cwd });
  });

  afterAll(async () => {
    dbConnection.close();
    await dropDatabase({ databaseName: "medusa-integration" });

    medusaProcess.kill();
  });

  describe("POST /store/returns", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(
        `ALTER SEQUENCE order_display_id_seq RESTART WITH 111`
      );

      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });

      await manager.insert(Customer, {
        id: "cus_1234",
        email: "test@email.com",
      });

      await manager.insert(Order, {
        id: "order_test",
        email: "test@email.com",
        display_id: 111,
        customer_id: "cus_1234",
        region_id: "region",
        tax_rate: 0,
        currency_code: "usd",
      });

      const defaultProfile = await manager.findOne(ShippingProfile, {
        type: "default",
      });

      await manager.insert(Product, {
        id: "test-product",
        title: "test product",
        profile_id: defaultProfile.id,
        options: [{ id: "test-option", title: "Size" }],
      });

      await manager.insert(ProductVariant, {
        id: "test-variant",
        title: "test variant",
        product_id: "test-product",
        inventory_quantity: 1,
        options: [
          {
            option_id: "test-option",
            value: "Size",
          },
        ],
      });

      await manager.insert(LineItem, {
        id: "test-item",
        order_id: "order_test",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      });

      await manager.insert(ShippingOption, {
        id: "test-option",
        name: "Test ret",
        profile_id: defaultProfile.id,
        region_id: "region",
        provider_id: "test-ful",
        data: {},
        price_type: "flat_rate",
        amount: 1000,
        is_return: true,
      });
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "shipping_method"`);
      await manager.query(`DELETE FROM "shipping_option"`);
      await manager.query(`DELETE FROM "return_item"`);
      await manager.query(`DELETE FROM "return"`);
      await manager.query(`DELETE FROM "line_item"`);
      await manager.query(`DELETE FROM "order"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(`DELETE FROM "region"`);

      await manager.query(`DELETE FROM "product_option_value"`);
      await manager.query(`DELETE FROM "product_option"`);
      await manager.query(`DELETE FROM "money_amount"`);
      await manager.query(`DELETE FROM "product_variant"`);
      await manager.query(`DELETE FROM "product"`);
    });

    it("creates a return", async () => {
      const api = useApi();

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response;
        });
      expect(response.status).toEqual(200);

      expect(response.data.return.refund_amount).toEqual(8000);
    });

    it("creates a return with shipping method", async () => {
      const api = useApi();

      const response = await api
        .post("/store/returns", {
          order_id: "order_test",
          return_shipping: {
            option_id: "test-option",
          },
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        })
        .catch((err) => {
          return err.response;
        });
      expect(response.status).toEqual(200);

      expect(response.data.return.refund_amount).toEqual(7000);
    });
  });
});
