const path = require("path");
const { dropDatabase } = require("pg-god");
const { Customer, Address } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

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
    await dropDatabase({ databaseName: "medusa-fixtures" });

    medusaProcess.kill();
  });

  describe("GET /admin/customers", () => {
    let id;

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        const manager = dbConnection.manager;

        const created = manager.create(Customer, {
          email: "test1@email.com",
        });

        const newly = await manager.save(created);

        id = newly.id;
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
        .get(`/admin/customers/${id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      fixtureWriter.addFixture("customer", response.data.customer);
    });
  });
});
