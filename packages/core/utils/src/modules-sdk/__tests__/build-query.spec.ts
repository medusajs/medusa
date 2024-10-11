import { buildQuery } from "../build-query"
import { SoftDeletableFilterKey } from "../../dal/mikro-orm/mikro-orm-soft-deletable-filter"

describe("buildQuery", () => {
  test("should return empty where and basic options when no filters or config provided", () => {
    const result = buildQuery()
    expect(result).toEqual({
      where: {},
      options: {
        populate: [],
        fields: undefined,
        limit: undefined,
        offset: undefined,
      },
    })
  })

  test("should build basic where clause", () => {
    const filters = { name: "test", age: 25 }
    const result = buildQuery(filters)
    expect(result.where).toEqual(filters)
  })

  test("should handle array values in filters", () => {
    const filters = { id: [1, 2, 3, 3] }
    const result = buildQuery(filters)
    expect(result.where).toEqual({ id: [1, 2, 3] }) // Deduplication
  })

  test("should handle nested object filters", () => {
    const filters = { user: { name: "John", age: 30 } }
    const result = buildQuery(filters)
    expect(result.where).toEqual(filters)
  })

  test("should handle $or operator", () => {
    const filters = { $or: [{ name: "John" }, { age: 30 }] }
    const result = buildQuery(filters)
    expect(result.where).toEqual(filters)
  })

  test("should handle $and operator", () => {
    const filters = { $and: [{ name: "John" }, { age: 30 }] }
    const result = buildQuery(filters)
    expect(result.where).toEqual(filters)
  })

  test("should apply config options", () => {
    const config = {
      relations: ["user", "order"],
      select: ["id", "name"],
      take: 10,
      skip: 5,
      order: { createdAt: "DESC" },
    }
    const result = buildQuery({}, config)
    expect(result.options).toMatchObject({
      populate: ["user", "order"],
      fields: ["id", "name"],
      limit: 10,
      offset: 5,
      orderBy: { createdAt: "DESC" },
    })
  })

  test("should handle withDeleted flag", () => {
    const filters = { deleted_at: "some-value" }
    const result = buildQuery(filters)
    expect(result.options.filters).toHaveProperty(SoftDeletableFilterKey)
    expect(result.options.filters?.[SoftDeletableFilterKey]).toEqual({
      withDeleted: true,
    })
  })

  test("should apply additional filters from config", () => {
    const config = {
      filters: {
        customFilter: { someOption: true },
      },
    }
    const result = buildQuery({}, config)
    expect(result.options.filters).toHaveProperty("customFilter")
    expect(result.options.filters?.["customFilter"]).toEqual({
      someOption: true,
    })
  })

  test("should merge options from config", () => {
    const config = {
      options: {
        customOption: "value",
      },
    }
    const result = buildQuery({}, config)
    expect(result.options).toHaveProperty("customOption", "value")
  })
})
