import { RuleOperator } from "@medusajs/utils"
import { isContextValid } from "../utils"

describe("isContextValidForRules", () => {
  const context = {
    attribute1: "value1",
    attribute2: "value2",
    attribute3: "value3",
  }

  const validRule = {
    attribute: "attribute1",
    operator: RuleOperator.EQ,
    value: "value1",
  }

  const invalidRule = {
    attribute: "attribute2",
    operator: RuleOperator.EQ,
    value: "wrongValue",
  }

  it("returns true when all rules are valid", () => {
    const rules = [validRule, validRule]
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns true when some rules are valid", () => {
    const rules = [validRule, validRule]
    const options = { someAreValid: true }
    expect(isContextValid(context, rules, options)).toBe(true)
  })

  it("returns true when some rules are valid and someAreValid is true", () => {
    const rules = [validRule, invalidRule]
    const options = { someAreValid: true }
    expect(isContextValid(context, rules, options)).toBe(true)
  })

  it("returns false when some rules are valid", () => {
    const rules = [validRule, invalidRule]
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns false when no rules are valid and someAreValid is true", () => {
    const rules = [invalidRule, invalidRule]
    const options = { someAreValid: true }
    expect(isContextValid(context, rules, options)).toBe(false)
  })

  it("returns false when no rules are valid", () => {
    const rules = [invalidRule, invalidRule]
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'gt' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.GT,
        value: "1", // 2 > 1
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'gt' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.GT,
        value: "0", // 0 > 0
      },
    ]
    const context = { attribute1: "0" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'gte' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.GTE,
        value: "2", // 2 >= 2
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'gte' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.GTE,
        value: "3", // 2 >= 3
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'lt' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.LT,
        value: "3", // 2 < 3
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'lt' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.LT,
        value: "2", // 2 < 2
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'lte' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.LTE,
        value: "2", // 2 <= 2
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  // ... existing tests ...

  it("returns false when the 'lte' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.LTE,
        value: "1", // 2 <= 1
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'in' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.IN,
        value: ["1", "2", "3"], // 2 in [1, 2, 3]
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'in' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.IN,
        value: ["1", "3", "4"], // 2 in [1, 3, 4]
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'nin' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.NIN,
        value: ["1", "3", "4"], // 2 not in [1, 3, 4]
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'nin' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.NIN,
        value: ["1", "2", "3"], // 2 not in [1, 2, 3]
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'ne' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.NE,
        value: "1", // 2 != 1
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'ne' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.NE,
        value: "2", // 2 != 2
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })

  it("returns true when the 'eq' operator is valid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.EQ,
        value: "2", // 2 == 2
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(true)
  })

  it("returns false when the 'eq' operator is invalid", () => {
    const rules = [
      {
        attribute: "attribute1",
        operator: RuleOperator.EQ,
        value: "1", // 2 == 1
      },
    ]
    const context = { attribute1: "2" }
    expect(isContextValid(context, rules)).toBe(false)
  })
})
