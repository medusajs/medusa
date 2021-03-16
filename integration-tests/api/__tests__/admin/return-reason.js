const { dropDatabase } = require("pg-god");
const path = require("path");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb } = require("../../../helpers/use-db");

const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/return-reasons", () => {
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

  describe("POST /admin/return-reasons", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection);
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    afterEach(async () => {
      const manager = dbConnection.manager;
      await manager.query(`DELETE FROM "return_reason"`);
      await manager.query(`DELETE FROM "user"`);
    });

    it("creates a return_reason", async () => {
      const api = useApi();

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      };

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      );
    });

    it("update a return reason", async () => {
      const api = useApi();

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      };

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big Typo",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      );

      const newResponse = await api
        .post(
          `/admin/return-reasons/${response.data.return_reason.id}`,
          {
            label: "Too Big",
            description: "new desc",
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });

      expect(newResponse.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "new desc",
          value: "too_big",
        })
      );
    });

    it("list return reasons", async () => {
      const api = useApi();

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      };

      await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      const response = await api
        .get("/admin/return-reasons", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err);
        });

      expect(response.status).toEqual(200);

      console.log(response.data);

      expect(response.data.return_reasons).toEqual([
        expect.objectContaining({
          value: "too_big",
        }),
      ]);
    });
  });
});
