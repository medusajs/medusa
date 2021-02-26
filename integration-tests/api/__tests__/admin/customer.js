const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const customerSeeder = require("../../helpers/customer-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/customers", () => {
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

  describe("GET /admin/customers", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        await customerSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "address"`);
      await manager.query(`DELETE FROM "customer"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("lists customers and query count", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/customers", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.count).toEqual(3);
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
          }),
          expect.objectContaining({
            id: "test-customer-2",
          }),
          expect.objectContaining({
            id: "test-customer-3",
          }),
        ])
      );
    });

    it("lists customers with specific query", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/customers?q=test2@email.com", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.count).toEqual(1);
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-2",
            email: "test2@email.com",
          }),
        ])
      );
    });

    it("lists customers with expand query", async () => {
      const api = useApi();

      const response = await api
        .get("/admin/customers?q=test1@email.com&expand=shipping_addresses", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);
      expect(response.data.count).toEqual(1);
      console.log(response.data.customers);
      expect(response.data.customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-customer-1",
            shipping_addresses: expect.arrayContaining([
              expect.objectContaining({
                id: "test-address",
                first_name: "Lebron",
                last_name: "James",
              }),
            ]),
          }),
        ])
      );
    });
  });
});
