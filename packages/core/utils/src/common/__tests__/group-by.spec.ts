import { groupBy } from "../group-by"

const array = [
  {
    id: "test-id-1",
    property: "test-id-1-property-1",
  },
  {
    id: "test-id-1",
    property: "test-id-1-property-2",
  },
  {
    id: "test-id-2",
    property: "test-id-2-property-1",
  },
  {
    id: "test-id-2",
    property: "test-id-2-property-2",
  },
  {
    id: "test-id-3",
    property: "test-id-3-property-1",
  },
]

const mapToObject = (map: Map<any, any>) => Object.fromEntries(map.entries())

describe("groupBy", function () {
  it("should return a map grouped by an identifier", function () {
    const response = mapToObject(groupBy(array, "id"))

    expect(response).toEqual({
      "test-id-1": [
        { id: "test-id-1", property: "test-id-1-property-1" },
        { id: "test-id-1", property: "test-id-1-property-2" },
      ],
      "test-id-2": [
        { id: "test-id-2", property: "test-id-2-property-1" },
        { id: "test-id-2", property: "test-id-2-property-2" },
      ],
      "test-id-3": [{ id: "test-id-3", property: "test-id-3-property-1" }],
    })
  })

  it("should return empty map if identifier is not found in array", function () {
    const response = mapToObject(groupBy(array, "doesnotexist"))

    expect(response).toEqual({})
  })

  it("should group by falsy but valid keys such as 0 and empty string", function () {
    const items = [
      { key: 0, property: "zero-a" },
      { key: 0, property: "zero-b" },
      { key: "", property: "empty-a" },
      { key: 1, property: "one-a" },
    ]

    const response = mapToObject(groupBy(items, "key"))

    expect(response).toEqual({
      0: [
        { key: 0, property: "zero-a" },
        { key: 0, property: "zero-b" },
      ],
      "": [{ key: "", property: "empty-a" }],
      1: [{ key: 1, property: "one-a" }],
    })
  })

  it("should skip items whose key is null or undefined", function () {
    const items = [
      { key: null, property: "null-a" },
      { key: undefined, property: "undefined-a" },
      { key: "keep", property: "keep-a" },
    ]

    const response = mapToObject(groupBy(items, "key"))

    expect(response).toEqual({
      keep: [{ key: "keep", property: "keep-a" }],
    })
  })
})
