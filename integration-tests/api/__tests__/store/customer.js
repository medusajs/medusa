const { dropDatabase } = require("pg-god");
const path = require("path");
const { Customer } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const customerSeeder = require("../../helpers/customer-seeder");

jest.setTimeout(30000);

describe("/store/customers", () => {
  let medusaProcess;
  let dbConnection;

  const doAfterEach = async (manager) => {
    await manager.query(`DELETE FROM "address"`);
    await manager.query(`DELETE FROM "customer"`);
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

  describe("POST /store/customers", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        has_account: true,
      });
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("creates a customer", async () => {
      const api = useApi();

      const response = await api.post("/store/customers", {
        first_name: "James",
        last_name: "Bond",
        email: "james@bond.com",
        password: "test",
      });

      expect(response.status).toEqual(200);
      expect(response.data.customer).not.toHaveProperty("password_hash");
    });

    it("responds 409 on duplicate", async () => {
      const api = useApi();

      const response = await api
        .post("/store/customers", {
          first_name: "James",
          last_name: "Bond",
          email: "john@deere.com",
          password: "test",
        })
        .catch((err) => err.response);

      expect(response.status).toEqual(409);
    });
  });

  describe("POST /store/customers/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;
      await manager.insert(Customer, {
        id: "test_customer",
        first_name: "John",
        last_name: "Deere",
        email: "john@deere.com",
        password_hash:
          "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
        has_account: true,
      });
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await doAfterEach(manager);
    });

    it("updates a customer", async () => {
      const api = useApi();

      const authResponse = await api.post("/store/auth", {
        email: "john@deere.com",
        password: "test",
      });

      const customerId = authResponse.data.customer.id;
      const [authCookie] = authResponse.headers["set-cookie"][0].split(";");
      console.log(authCookie);

      const response = await api.post(
        `/store/customers/${customerId}`,
        {
          password: "test",
          metadata: { key: "value" },
        },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      );

      expect(response.status).toEqual(200);
      expect(response.data.customer).not.toHaveProperty("password_hash");
      expect(response.data.customer).toEqual(
        expect.objectContaining({
          metadata: { key: "value" },
        })
      );
    });
  });
});
