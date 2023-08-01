import { reMapKeysAndPick } from "../re-map-keys-and-pick"

describe("reMapKeysAndPick", function () {
  it("should return a new object with the keys remapped and the values picked from the original object based on the map config", function () {
    const input = {
      a: [{ id: "1" }, { id: "2" }],
      b: [{ id: "3" }, { id: "4", handle: "handle1" }],
      c: [{ id: "5", sku: "sku1" }, { id: "6" }],
    }

    const remapMap = new Map<
      string,
      { newKey: string; getter: (object: any) => string }[]
    >([
      ["a", [{ newKey: "a.id", getter: (o) => o.id }]],
      [
        "b",
        [
          { newKey: "b.id", getter: (o) => o.id },
          { newKey: "b.handle", getter: (o) => o.handle },
        ],
      ],
      [
        "c",
        [
          { newKey: "c.id", getter: (o) => o.id },
          { newKey: "c.sku", getter: (o) => o.sku },
        ],
      ],
    ])

    const remappedObject = reMapKeysAndPick(input, remapMap)

    expect(remappedObject).toEqual({
      "a.id": ["1", "2"],
      "b.id": ["3", "4"],
      "b.handle": ["handle1"],
      "c.id": ["5", "6"],
      "c.sku": ["sku1"],
    })
  })
})
