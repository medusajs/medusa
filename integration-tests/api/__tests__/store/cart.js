const { dropDatabase } = require("pg-god");
const path = require("path");
const { Region } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const cartSeeder = require("../../helpers/cart-seeder");

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
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
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
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
    });

    it("updates cart customer id", async () => {
      const api = useApi();

      const response = await api.post("/store/carts/test-cart", {
        customer_id: "test-customer-2",
      });

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
      await manager.query(`DELETE FROM "cart"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(
        `UPDATE "country" SET region_id=NULL WHERE iso_2 = 'us'`
      );
      await manager.query(`DELETE FROM "region"`);
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
});
