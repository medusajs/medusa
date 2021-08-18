const path = require("path");
const {
  Region,
  ShippingProfile,
  ShippingOption,
  ShippingOptionRequirement,
} = require("@medusajs/medusa");

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

        const defaultProfile = await manager.findOne(ShippingProfile, {
          type: "default",
        });

        await manager.insert(ShippingOption, {
          id: "test-out",
          name: "Test out",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 2000,
          is_return: false,
        });

        await manager.insert(ShippingOption, {
          id: "test-option-req",
          name: "With req",
          profile_id: defaultProfile.id,
          region_id: "region",
          provider_id: "test-ful",
          data: {},
          price_type: "flat_rate",
          amount: 2000,
          is_return: false,
        });

        await manager.insert(ShippingOptionRequirement, {
          id: "option-req",
          shipping_option_id: "test-option-req",
          type: "min_subtotal",
          amount: 5,
        });

        await manager.insert(ShippingOptionRequirement, {
          id: "option-req-2",
          shipping_option_id: "test-option-req",
          type: "max_subtotal",
          amount: 10,
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
            type: "min_subtotal",
            amount: 1,
          },
          {
            type: "max_subtotal",
            amount: 2,
          },
        ],
      };

      const res = await api.post(`/admin/shipping-options/test-out`, payload, {
        headers: {
          Authorization: "Bearer test_token",
        },
      });

      const requirements = res.data.shipping_option.requirements;

      expect(res.status).toEqual(200);
      expect(requirements.length).toEqual(2);
      expect(requirements[0]).toEqual(
        expect.objectContaining({
          type: "min_subtotal",
          shipping_option_id: "test-out",
          amount: 1,
        })
      );
      expect(requirements[1]).toEqual(
        expect.objectContaining({
          type: "max_subtotal",
          shipping_option_id: "test-out",
          amount: 2,
        })
      );
    });

    it("fails as it is not allowed to set id from client side", async () => {
      const api = useApi();

      const payload = {
        name: "Test option",
        amount: 100,
        requirements: [
          {
            id: "not_allowed",
            type: "min_subtotal",
            amount: 1,
          },
          {
            id: "really_not_allowed",
            type: "max_subtotal",
            amount: 2,
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
          return err.response;
        });

      expect(res.status).toEqual(400);
      expect(res.data.message).toEqual("ID does not exist");
    });

    it("it succesfully updates a set of existing requirements", async () => {
      const api = useApi();

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 15,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 20,
          },
        ],
        amount: 200,
      };

      const res = await api
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });

      expect(res.status).toEqual(200);
    });

    it("it succesfully updates a set of existing requirements by updating one and deleting the other", async () => {
      const api = useApi();

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 15,
          },
        ],
      };

      const res = await api
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });

      expect(res.status).toEqual(200);
    });

    it("succesfully updates a set of requirements because max. subtotal >= min. subtotal", async () => {
      const api = useApi();

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 150,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 200,
          },
        ],
      };

      const res = await api
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });

      expect(res.status).toEqual(200);
      expect(res.data.shipping_option.requirements[0].amount).toEqual(150);
      expect(res.data.shipping_option.requirements[1].amount).toEqual(200);
    });

    it("fails to updates a set of requirements because max. subtotal <= min. subtotal", async () => {
      const api = useApi();

      const payload = {
        requirements: [
          {
            id: "option-req",
            type: "min_subtotal",
            amount: 1500,
          },
          {
            id: "option-req-2",
            type: "max_subtotal",
            amount: 200,
          },
        ],
      };

      const res = await api
        .post(`/admin/shipping-options/test-option-req`, payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          return err.response;
        });

      expect(res.status).toEqual(400);
      expect(res.data.message).toEqual(
        "Max. subtotal must be greater than Min. subtotal"
      );
    });
  });
});
