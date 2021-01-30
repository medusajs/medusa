const { getManager, createConnection } = require("typeorm");
const { dropDatabase } = require("pg-god");
const { spawn } = require("child_process");
const path = require("path");

const { Region } = require("@medusajs/medusa/dist/models/region");
const modelsLoader = require("@medusajs/medusa/dist/loaders/models").default;
const axios = require("axios");

const { useApi, setPort } = require("../../../helpers/use-api");

jest.setTimeout(30000);

// const { initialize } = require("../../../helpers/setup");

describe("/store/carts", () => {
  let proc;
  let server;
  let dbConnection;

  const setupPath = path.join(__dirname, "..", "..", "setup.js");

  beforeAll(async (done) => {
    proc = spawn("node", [path.resolve(setupPath)], {
      cwd: path.resolve(path.join(__dirname, "..", "..")),
      env: {
        ...process.env,
        NODE_ENV: "development",
        JWT_SECRET: "test",
        COOKIE_SECRET: "test",
      },
      stdio: ["ignore", "ignore", "inherit", "ipc"],
    });

    proc.on("error", (err) => {
      console.log(err);
      process.kill();
    });

    proc.on("message", async (msg) => {
      setPort(msg);

      const entities = modelsLoader({}, { register: false });
      dbConnection = await createConnection({
        type: "postgres",
        url: "postgres://localhost/medusa-integration",
        entities,
      });

      done();
    });
  });

  afterAll(async () => {
    dbConnection.close();
    dropDatabase({ databaseName: "medusa-integration" });

    proc.kill();
    // console.log("kill");
    // await dbConnection.close();
    // server.close(done);
  });

  describe("POST /store/carts", () => {
    beforeEach(async () => {
      const manager = await getManager();
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      });
    });

    it("creates a cart", async () => {
      const api = useApi();

      const response = await api.post("/store/carts");
      expect(response.status).toEqual(200);

      const getRes = await api.post(`/store/carts/${response.data.cart.id}`);
      expect(getRes.status).toEqual(200);
    });
  });
});
