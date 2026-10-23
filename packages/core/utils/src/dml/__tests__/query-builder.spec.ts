import { buildWhereQuery } from "../helpers/entity-builder/query-builder"

describe("buildWhereQuery", () => {
  it("should quote camelCase column names in $ne null condition", () => {
    const result = buildWhereQuery({ externalCode: { $ne: null } })
    expect(result).toEqual('"externalCode" IS NOT NULL')
  })

  it("should quote camelCase column names in null condition", () => {
    const result = buildWhereQuery({ externalCode: null })
    expect(result).toEqual('"externalCode" IS NULL')
  })

  it("should quote camelCase column names in boolean conditions", () => {
    expect(buildWhereQuery({ isSpecial: true })).toEqual('"isSpecial" IS TRUE')
    expect(buildWhereQuery({ isSpecial: false })).toEqual('"isSpecial" IS FALSE')
  })

  it("should quote camelCase column names in equality and $ne value conditions", () => {
    expect(buildWhereQuery({ externalCode: "WIDGET_1" })).toEqual(
      '"externalCode" = \'WIDGET_1\''
    )
    expect(buildWhereQuery({ externalCode: { $ne: "WIDGET_2" } })).toEqual(
      '"externalCode" != \'WIDGET_2\''
    )
  })

  it("should preserve unquoted column names for snake_case and lowercase identifiers", () => {
    expect(buildWhereQuery({ email: { $ne: null } })).toEqual("email IS NOT NULL")
    expect(buildWhereQuery({ deleted_at: null })).toEqual("deleted_at IS NULL")
    expect(buildWhereQuery({ is_owner: false })).toEqual("is_owner IS FALSE")
    expect(buildWhereQuery({ account: "primary" })).toEqual("account = 'primary'")
  })

  it("should handle already-quoted column names without double-quoting", () => {
    expect(buildWhereQuery({ '"externalCode"': { $ne: null } })).toEqual(
      '"externalCode" IS NOT NULL'
    )
  })

  it("should quote qualified column names when containing camelCase tokens", () => {
    expect(buildWhereQuery({ "widget.externalCode": { $ne: null } })).toEqual(
      'widget."externalCode" IS NOT NULL'
    )
  })

  it("should combine multiple conditions with AND", () => {
    const result = buildWhereQuery({
      externalCode: { $ne: null },
      deleted_at: null,
      isSpecial: true,
    })
    expect(result).toEqual(
      '"externalCode" IS NOT NULL AND deleted_at IS NULL AND "isSpecial" IS TRUE'
    )
  })

  it("should throw an error when a condition value is undefined", () => {
    expect(() =>
      buildWhereQuery({ externalCode: undefined as any })
    ).toThrow(
      "value cannot be undefined when building where query for an index"
    )
  })
})
