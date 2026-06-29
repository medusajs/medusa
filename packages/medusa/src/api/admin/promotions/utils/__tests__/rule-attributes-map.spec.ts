import { RuleOperator } from "@zjedene-medusa/framework/utils"
import { getRuleAttributesMap } from "../rule-attributes-map"

const findAttr = (attrs: any[], value: string) =>
  attrs.find((a) => a.value === value)

const operatorValues = (attr: any) =>
  (Array.isArray(attr.operators) ? attr.operators : [attr.operators]).map(
    (o: any) => o.value
  )

describe("getRuleAttributesMap - native filter attributes", () => {
  describe("global rules", () => {
    const rules = getRuleAttributesMap({}).rules

    it("exposes a numeric `total` attribute with numeric operators", () => {
      const attr = findAttr(rules, "total")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("number")
      const ops = operatorValues(attr)
      expect(ops).toEqual(
        expect.arrayContaining([
          RuleOperator.GTE,
          RuleOperator.LTE,
          RuleOperator.GT,
          RuleOperator.LT,
          RuleOperator.EQ,
        ])
      )
    })

    it("exposes a text `shipping_address.city` attribute with set operators", () => {
      const attr = findAttr(rules, "shipping_address.city")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("text")
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([
          RuleOperator.IN,
          RuleOperator.EQ,
          RuleOperator.NE,
        ])
      )
    })

    it("exposes a numeric `customer_order_count` attribute", () => {
      const attr = findAttr(rules, "customer_order_count")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("number")
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([RuleOperator.EQ, RuleOperator.GT])
      )
    })

    it("exposes an `is_logged_in` select attribute", () => {
      const attr = findAttr(rules, "is_logged_in")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("select")
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([RuleOperator.EQ])
      )
    })

    it("exposes a `current_day_of_week` multiselect attribute", () => {
      const attr = findAttr(rules, "current_day_of_week")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("multiselect")
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([RuleOperator.IN])
      )
    })

    it("exposes a numeric `current_minutes` attribute", () => {
      const attr = findAttr(rules, "current_minutes")
      expect(attr).toBeDefined()
      expect(attr.field_type).toEqual("number")
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([RuleOperator.GTE, RuleOperator.LTE])
      )
    })
  })

  describe("item (target/buy) rules", () => {
    it("exposes a `box_type` attribute reading product metadata", () => {
      const targetRules = getRuleAttributesMap({})["target-rules"]
      const attr = findAttr(targetRules, "items.product.metadata.box_type")
      expect(attr).toBeDefined()
      expect(operatorValues(attr)).toEqual(
        expect.arrayContaining([
          RuleOperator.IN,
          RuleOperator.EQ,
          RuleOperator.NE,
        ])
      )
    })
  })
})
