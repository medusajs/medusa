import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { evaluateRuleValueCondition } from "../../../../src/utils/validations/promotion-rule"

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: () => {
    describe("evaluateRuleValueCondition", () => {
      const testFunc = evaluateRuleValueCondition

      describe("eq", () => {
        const operator = "eq"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc(["2"], operator, [2])).toEqual(true)
          expect(testFunc(["2"], operator, ["2"])).toEqual(true)
          expect(testFunc(["2"], operator, ["22"])).toEqual(false)
        })
      })

      describe("in", () => {
        const operator = "in"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc(["1", "2"], operator, [2])).toEqual(true)
          expect(testFunc(["2"], operator, ["2"])).toEqual(true)
          expect(testFunc(["2"], operator, ["22"])).toEqual(false)
        })
      })

      describe("ne", () => {
        const operator = "ne"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc(["2"], operator, [2])).toEqual(false)
          expect(testFunc(["2"], operator, ["2"])).toEqual(false)
          expect(testFunc(["2"], operator, ["22"])).toEqual(true)
          expect(testFunc(["2"], operator, [])).toEqual(true)
        })
      })

      describe("gt", () => {
        const operator = "gt"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc(["2"], operator, [1])).toEqual(false)
          expect(testFunc(["2"], operator, ["1"])).toEqual(false)
          expect(testFunc(["2"], operator, [2])).toEqual(false)
          expect(testFunc(["2"], operator, ["2"])).toEqual(false)
          expect(testFunc(["2"], operator, ["22"])).toEqual(true)
          expect(testFunc(["2"], operator, [22])).toEqual(true)
        })
      })

      describe("gte", () => {
        const operator = "gte"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc(["2"], operator, [1])).toEqual(false)
          expect(testFunc(["2"], operator, ["1"])).toEqual(false)
          expect(testFunc(["2"], operator, [2])).toEqual(true)
          expect(testFunc(["2"], operator, ["2"])).toEqual(true)
          expect(testFunc(["2"], operator, ["22"])).toEqual(true)
          expect(testFunc(["2"], operator, [22])).toEqual(true)
        })
      })

      describe("lt", () => {
        const operator = "lt"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc([1], operator, ["2"])).toEqual(false)
          expect(testFunc(["1"], operator, ["2"])).toEqual(false)
          expect(testFunc([2], operator, ["2"])).toEqual(false)
          expect(testFunc(["2"], operator, ["2"])).toEqual(false)
          expect(testFunc(["22"], operator, ["2"])).toEqual(true)
          expect(testFunc([22], operator, ["2"])).toEqual(true)
        })
      })

      describe("lte", () => {
        const operator = "lte"

        it("should evaluate conditions accurately", async () => {
          expect(testFunc([1], operator, ["2"])).toEqual(false)
          expect(testFunc(["1"], operator, ["2"])).toEqual(false)
          expect(testFunc([2], operator, ["2"])).toEqual(true)
          expect(testFunc(["2"], operator, ["2"])).toEqual(true)
          expect(testFunc(["22"], operator, ["2"])).toEqual(true)
          expect(testFunc([22], operator, ["2"])).toEqual(true)
        })
      })
    })
  },
})
