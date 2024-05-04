import { createRuleTypes } from "../../../__fixtures__/rule-type"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { Modules } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PRICING,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IPricingModuleService>) => {
    describe("PricingModuleService ruleType", () => {
      beforeEach(async () => {
        const testManager = MikroOrmWrapper.forkManager()
        await createRuleTypes(testManager)
      })

      describe("listRuleTypes", () => {
        it("should list rule types", async () => {
          const ruleTypeResult = await service.listRuleTypes()

          expect(ruleTypeResult).toEqual([
            expect.objectContaining({
              id: "rule-type-1",
              name: "rule 1",
            }),
            expect.objectContaining({
              id: "rule-type-2",
              name: "rule 2",
            }),
          ])
        })

        it("should list rule types by id", async () => {
          const ruleTypeResult = await service.listRuleTypes({
            id: ["rule-type-1"],
          })

          expect(ruleTypeResult).toEqual([
            expect.objectContaining({
              id: "rule-type-1",
              name: "rule 1",
            }),
          ])
        })
      })

      describe("listAndCountRuleTypes", () => {
        it("should return rule types and count", async () => {
          const [ruleTypeResult, count] = await service.listAndCountRuleTypes()

          expect(count).toEqual(2)
          expect(ruleTypeResult).toEqual([
            expect.objectContaining({
              id: "rule-type-1",
              name: "rule 1",
            }),
            expect.objectContaining({
              id: "rule-type-2",
              name: "rule 2",
            }),
          ])
        })

        it("should return rule types and count when filtered", async () => {
          const [ruleTypeResult, count] = await service.listAndCountRuleTypes({
            id: ["rule-type-1"],
          })

          expect(count).toEqual(1)
          expect(ruleTypeResult).toEqual([
            expect.objectContaining({
              id: "rule-type-1",
              name: "rule 1",
            }),
          ])
        })

        it("should return rule types and count when using skip and take", async () => {
          const [ruleTypeResult, count] = await service.listAndCountRuleTypes(
            {},
            { skip: 1, take: 1 }
          )

          expect(count).toEqual(2)
          expect(ruleTypeResult).toEqual([
            expect.objectContaining({
              id: "rule-type-2",
              name: "rule 2",
            }),
          ])
        })

        it("should return requested fields", async () => {
          const [ruleTypeResult, count] = await service.listAndCountRuleTypes(
            {},
            {
              take: 1,
              select: ["name"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(ruleTypeResult))

          expect(count).toEqual(2)
          expect(serialized).toEqual([
            {
              id: "rule-type-1",
              name: "rule 1",
            },
          ])
        })
      })

      describe("retrieveRuleType", () => {
        it("should return ruleType for the given id", async () => {
          const ruleType = await service.retrieveRuleType("rule-type-1")

          expect(ruleType).toEqual(
            expect.objectContaining({
              id: "rule-type-1",
              name: "rule 1",
            })
          )
        })

        it("should throw an error when ruleType with id does not exist", async () => {
          let error

          try {
            await service.retrieveRuleType("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "RuleType with id: does-not-exist was not found"
          )
        })

        it("should throw an error when an id is not provided", async () => {
          let error

          try {
            await service.retrieveRuleType(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("ruleType - id must be defined")
        })

        it("should return ruleType based on config select param", async () => {
          const ruleTypeResult = await service.retrieveRuleType("rule-type-1", {
            select: ["name"],
          })

          const serialized = JSON.parse(JSON.stringify(ruleTypeResult))

          expect(serialized).toEqual({
            name: "rule 1",
            id: "rule-type-1",
          })
        })
      })

      describe("deleteRuleTypes", () => {
        const id = "rule-type-1"

        it("should delete the ruleTypes given an id successfully", async () => {
          await service.deleteRuleTypes([id])

          const currencies = await service.listRuleTypes({
            id: [id],
          })

          expect(currencies).toHaveLength(0)
        })
      })

      describe("updateRuleTypes", () => {
        const id = "rule-type-1"

        it("should update the name of the ruleType successfully", async () => {
          await service.updateRuleTypes([
            {
              id,
              name: "rule 3",
            },
          ])

          const ruletype = await service.retrieveRuleType(id)

          expect(ruletype.name).toEqual("rule 3")
        })

        it("should throw an error when a id does not exist", async () => {
          let error

          try {
            await service.updateRuleTypes([
              {
                id: "does-not-exist",
                name: "rule 3",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'RuleType with id "does-not-exist" not found'
          )
        })
      })

      describe("createRuleTypes", () => {
        it("should create a ruleType successfully", async () => {
          await service.createRuleTypes([
            {
              name: "Test Rule",
              rule_attribute: "region_id",
            },
          ])

          const [ruleType] = await service.listRuleTypes({
            name: ["Test Rule"],
          })

          expect(ruleType).toEqual(
            expect.objectContaining({
              name: "Test Rule",
              rule_attribute: "region_id",
            })
          )
        })
      })
    })
  },
})
