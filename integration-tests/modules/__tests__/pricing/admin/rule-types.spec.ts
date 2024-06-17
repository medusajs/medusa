import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, RuleTypeDTO } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Pricing Rule Types API", () => {
      let appContainer
      let pricingModule: IPricingModuleService
      let ruleTypes: RuleTypeDTO[]

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        ruleTypes = await pricingModule.createRuleTypes([
          { name: "Customer Group ID", rule_attribute: "customer_group_id" },
          { name: "Region ID", rule_attribute: "region_id" },
        ])
      })

      describe("GET /admin/pricing", () => {
        it("should get all rule types and its prices with rules", async () => {
          let response = await api.get(
            `/admin/pricing/rule-types`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.rule_types).toEqual([
            expect.objectContaining({ id: expect.any(String) }),
            expect.objectContaining({ id: expect.any(String) }),
          ])

          response = await api.get(
            `/admin/pricing/rule-types?fields=id,rule_attribute,created_at`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.rule_types).toEqual(
            expect.arrayContaining([
              {
                id: ruleTypes[0].id,
                rule_attribute: ruleTypes[0].rule_attribute,
                created_at: expect.any(String),
              },
              {
                id: ruleTypes[1].id,
                rule_attribute: ruleTypes[1].rule_attribute,
                created_at: expect.any(String),
              },
            ])
          )
        })
      })

      describe("GET /admin/pricing/:id", () => {
        it("should retrieve a rule type and its prices with rules", async () => {
          const ruleType = ruleTypes[0]

          let response = await api.get(
            `/admin/pricing/rule-types/${ruleType.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.rule_type).toEqual(
            expect.objectContaining({
              id: ruleType.id,
            })
          )

          response = await api.get(
            `/admin/pricing/rule-types/${ruleType.id}?fields=id,created_at`,
            adminHeaders
          )

          expect(response.data.rule_type).toEqual({
            id: ruleType.id,
            created_at: expect.any(String),
          })
        })

        it("should throw an error when rule type is not found", async () => {
          const error = await api
            .get(`/admin/pricing/rule-types/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(error.response.status).toBe(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: "RuleType with id: does-not-exist was not found",
          })
        })
      })

      describe("POST /admin/pricing/rule-types", () => {
        it("should throw an error if required params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/pricing/rule-types`,
              {
                rule_attribute: "rule_attr_test1",
                default_priority: 7,
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data.message).toEqual(
          //   "name must be a string, name should not be empty"
          // )
        })

        it("should create a rule type successfully", async () => {
          const response = await api.post(
            `/admin/pricing/rule-types`,
            {
              name: "test",
              rule_attribute: "rule_attr_test",
              default_priority: 6,
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.rule_type).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "test",
              rule_attribute: "rule_attr_test",
              default_priority: 6,
            })
          )
        })
      })

      describe("POST /admin/pricing/rule-types/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .post(`/admin/pricing/rule-types/does-not-exist`, {}, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `RuleType with id "does-not-exist" not found`
          )
        })

        it("should update a rule type successfully", async () => {
          const [ruleType] = ruleTypes

          const response = await api.post(
            `/admin/pricing/rule-types/${ruleType.id}`,
            {
              name: "test update",
              rule_attribute: "test_update",
              default_priority: 7,
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.rule_type).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "test update",
              rule_attribute: "test_update",
              default_priority: 7,
            })
          )
        })
      })

      describe("DELETE /admin/pricing/rule-types/:id", () => {
        it("should delete rule type successfully", async () => {
          const [ruleType] = ruleTypes
          const response = await api.delete(
            `/admin/pricing/rule-types/${ruleType.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            id: ruleType.id,
            object: "rule_type",
            deleted: true,
          })

          const deletedRuleTypes = await pricingModule.listRuleTypes({
            id: [ruleType.id],
          })

          expect(deletedRuleTypes.length).toEqual(0)
        })

        it("should return 200 when id does not exist", async () => {
          const response = await api.delete(
            `/admin/pricing/rule-types/does-not-exist`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            id: "does-not-exist",
            object: "rule_type",
            deleted: true,
          })
        })
      })
    })
  },
})
