const path = require("path");
const { Region, ShippingProfile, ShippingOption } = require("@medusajs/medusa");

const setupServer = require("../../../helpers/setup-server");
const { useApi } = require("../../../helpers/use-api");
const { initDb, useDb } = require("../../../helpers/use-db");
const adminSeeder = require("../../helpers/admin-seeder");

jest.setTimeout(30000);

describe("/admin/shipping-options", () => {
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

  describe("POST /admin/shipping-options", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager;

      try {
        await adminSeeder(dbConnection);

        await manager.insert(Region, {
          id: "region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        });

        await manager.insert(Region, {
          id: "region2",
          name: "Test Region 2",
          currency_code: "usd",
          tax_rate: 0,
        });

        const defaultProfile = await manager.findOne(ShippingProfile, {
          type: "default",
        });

        await manager.insert(ShippingOption, {
          id: "test-out",
          name: "Test out",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          requirements: [],
          data: {},
          price_type: "flat_rate",
          amount: 2000,
          is_return: false,
        });

        await manager.insert(ShippingOption, {
          id: "test-return",
          name: "Test ret",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          requirements: [],
          data: {},
          price_type: "flat_rate",
          amount: 1000,
          is_return: true,
        });

        await manager.insert(ShippingOption, {
          id: "test-region2",
          name: "Test region 2",
          profile_id: defaultProfile.id,
          region_id: "region2",
          provider_id: "test-ful",
          requirements: [],
          data: {},
          price_type: "flat_rate",
          amount: 1000,
          is_return: false,
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    });

    afterEach(async () => {
      const db = useDb();
      await db.teardown();
    });

    it("updates a shipping option with no existing requirements", async () => {
      const api = useApi();

      const payload = {
        name: "Test option",
        amount: 100,
        requirements: [
          {
            id: "yes",
            type: "min_subtotal",
            amount: 1,
          },
          {
            id: "yes_1",
            type: "max_subtotal",
            amount: 1,
          },
        ],
      };

      const res = await api
        .post(`/admin/shipping-options/test-out`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.error(err);
        });

      const requirements = res.data.shipping_option.requirements;

      expect(res.status).toEqual(200);
      expect(requirements.length).toEqual(2);
      expect(requirements[0]).toEqual({
        id: "yes",
        type: "min_subtotal",
        shipping_option_id: "test-out",
        amount: 1,
      });
      expect(requirements[1]).toEqual({
        id: "yes_1",
        type: "max_subtotal",
        shipping_option_id: "test-out",
        amount: 1,
      });
    });
  });
});
