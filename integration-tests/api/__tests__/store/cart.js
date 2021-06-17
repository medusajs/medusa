const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");
const { expectRelations } = require("../../helpers/expect-relations");

const cartSeeder = require("../../helpers/cart-seeder");
const productSeeder = require("../../helpers/product-seeder");

jest.setTimeout(30000);

describe("/store/carts", () => {
  let medusaProcess;
  let dbConnection;

  const doAfterEach = async (manager) => {
    await manager.query(`DELETE FROM "discount"`);
    await manager.query(`DELETE FROM "discount_rule"`);
    await manager.query(`DELETE FROM "shipping_method"`);
    await manager.query(`DELETE FROM "shipping_option"`);
    await manager.query(`DELETE FROM "cart"`);
    await manager.query(`DELETE FROM "address"`);
    await manager.query(`DELETE FROM "customer"`);
    await manager.query(
      `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
    );
    await manager.query(`DELETE FROM "region"`);
  };

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

  describe("POST /store/carts", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });
      await manager.query(
        `UPDATE "country" SET region_id='region' WHERE iso_2 = 'us'`
      );
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("creates a cart", async () => {
      const api = useApi();

      const response = await api.post("/store/carts");
      expect(response.status).toEqual(200);

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`);
      expect(getRes.status).toEqual(200);
    });

    it("creates a cart with country", async () => {
      const api = useApi();

      const response = await api.post("/store/carts", {
        country_code: "us",
      });
      expect(response.status).toEqual(200);
      expect(response.data.cart.shipping_address.country_code).toEqual("us");

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`);
      expect(getRes.status).toEqual(200);
    });

    it("creates a cart with context", async () => {
      const api = useApi();
      const response = await api.post("/store/carts", {
        context: {
          test_id: "test",
        },
      });
      expect(response.status).toEqual(200);

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`);
      expect(getRes.status).toEqual(200);

      const cart = getRes.data.cart;
      expect(cart.context).toEqual({
        ip: "::ffff:127.0.0.1",
        user_agent: "axios/0.21.1",
        test_id: "test",
      });
    });
  });

  describe("POST /store/carts/:id", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("fails on apply discount if limit has been reached", async () => {
      const api = useApi();

      try {
        await api.post("/store/carts/test-cart", {
          discounts: [{ code: "CREATED" }],
        });
      } catch (error) {
        expect(error.response.status).toEqual(400);
        expect(error.response.data.message).toEqual(
          "Discount has been used maximum allowed times"
        );
      }
    });

    it("updates cart customer id", async () => {
      const api = useApi();

      const response = await api.post("/store/carts/test-cart", {
        customer_id: "test-customer-2",
      });

      expect(response.status).toEqual(200);
    });

    it("updates address using string id", async () => {
      const api = useApi();

      const response = await api.post("/store/carts/test-cart", {
        billing_address: "test-general-address",
        shipping_address: "test-general-address",
      });

      expect(response.data.cart.shipping_address_id).toEqual(
        "test-general-address"
      );
      expect(response.data.cart.billing_address_id).toEqual(
        "test-general-address"
      );
      expect(response.status).toEqual(200);
    });

    it("updates address", async () => {
      const api = useApi();

      const response = await api.post("/store/carts/test-cart", {
        shipping_address: {
          first_name: "clark",
          last_name: "kent",
          address_1: "5th avenue",
          city: "nyc",
          country_code: "us",
          postal_code: "something",
        },
      });

      expect(response.data.cart.shipping_address.first_name).toEqual("clark");
      expect(response.status).toEqual(200);
    });

    it("adds free shipping to cart then removes it again", async () => {
      const api = useApi();

      let cart = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "FREE_SHIPPING" }, { code: "CREATED" }],
        },
        { withCredentials: true }
      );

      expect(cart.data.cart.shipping_total).toBe(0);
      expect(cart.status).toEqual(200);

      cart = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "CREATED" }],
        },
        { withCredentials: true }
      );

      expect(cart.data.cart.shipping_total).toBe(1000);
      expect(cart.status).toEqual(200);
    });
  });

  describe("DELETE /store/carts/:id/discounts/:code", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection);
        await dbConnection.manager.query(
          `INSERT INTO "cart_discounts" (cart_id, discount_id) VALUES ('test-cart', 'free-shipping')`
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("removes free shipping and updates shipping total", async () => {
      const api = useApi();

      const cartWithFreeShipping = await api.post(
        "/store/carts/test-cart",
        {
          discounts: [{ code: "FREE_SHIPPING" }],
        },
        { withCredentials: true }
      );

      expect(cartWithFreeShipping.data.cart.shipping_total).toBe(0);
      expect(cartWithFreeShipping.status).toEqual(200);

      const response = await api.delete(
        "/store/carts/test-cart/discounts/FREE_SHIPPING"
      );

      expect(response.data.cart.shipping_total).toBe(1000);
      expect(response.status).toEqual(200);
    });
  });

  describe("get-cart with session customer", () => {
    beforeEach(async () => {
      try {
        await cartSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("updates empty cart.customer_id on cart retrieval", async () => {
      const api = useApi();

      let customer = await api.post(
        "/store/customers",
        {
          email: "oli@test.dk",
          password: "olitest",
          first_name: "oli",
          last_name: "oli",
        },
        { withCredentials: true }
      );

      const cookie = customer.headers["set-cookie"][0];

      const cart = await api.post(
        "/store/carts",
        {},
        { withCredentials: true }
      );

      const response = await api.get(`/store/carts/${cart.data.cart.id}`, {
        headers: {
          cookie,
        },
        withCredentials: true,
      });

      expect(response.data.cart.customer_id).toEqual(customer.data.customer.id);
      expect(response.status).toEqual(200);
    });

    it("updates cart.customer_id on cart retrieval if cart.customer_id differ from session customer", async () => {
      const api = useApi();

      let customer = await api.post(
        "/store/customers",
        {
          email: "oli@test.dk",
          password: "olitest",
          first_name: "oli",
          last_name: "oli",
        },
        { withCredentials: true }
      );

      const cookie = customer.headers["set-cookie"][0];

      const cart = await api.post("/store/carts");

      const updatedCart = await api.post(`/store/carts/${cart.data.cart.id}`, {
        customer_id: "test-customer",
      });

      const response = await api.get(
        `/store/carts/${updatedCart.data.cart.id}`,
        {
          headers: {
            cookie,
          },
        }
      );

      expect(response.data.cart.customer_id).toEqual(customer.data.customer.id);
      expect(response.status).toEqual(200);
    });
  });

  describe("get-cart returns expected relations", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection);
        await cartSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

  
    it("returns default relations", async () => {
      const api = useApi();

      const expectedRelations = [
        "gift_cards",
        "region",
        "items.variant.prices",
        "payment",
        "shipping_address",
        "billing_address",
        "region.countries",
        "region.payment_providers",
        "payment_sessions",
        "shipping_methods.shipping_option",
        "discounts",
      ]

      await api.post("/store/carts/test-cart/line-items", {
        quantity: 1,
        variant_id: "test-variant",
      })

      // await api.post("/store/carts/test-cart/shipping-methods", {
      //   option_id: "test-option"
      // })


      const response = await api.get("/store/carts/test-cart")

      console.log(response.data.cart)
      expectRelations(expectedRelations, response.data.cart)

    });
  });
});
