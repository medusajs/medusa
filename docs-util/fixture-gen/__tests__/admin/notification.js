const { dropDatabase } = require("pg-god");
const path = require("path");
const { Notification } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const orderSeeder = require("../../helpers/order-seeder");
const adminSeeder = require("../../helpers/admin-seeder");

const fixtureWriter = require("../../utils/write-fixture").default;

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
    await dropDatabase({ databaseName: "medusa-fixtures" });

    medusaProcess.kill();
  });

  describe("GET /notifications", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
        const manager = dbConnection.manager;

        const noti = manager.create(Notification, {
          event_name: "order.placed",
          resource_type: "order",
          resource_id: "order_01F0BF66ZBXNJ98WDQ9SCWH8Y7",
          provider_id: "test-not",
          data: {},
          to: "test@email.com",
        });
        await manager.save(noti);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "notification"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a claim", async () => {
      const api = useApi();

      const response = await api.get(`/admin/notifications`, {
        headers: {
          authorization: "Bearer test_token",
        },
      });
      expect(response.status).toEqual(200);

      fixtureWriter.addFixture("notification", response.data.notifications[0]);
    });
  });
});
