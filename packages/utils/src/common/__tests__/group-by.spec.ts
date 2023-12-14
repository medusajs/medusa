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
})
