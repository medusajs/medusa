import { operatorMapReMapper } from "../operator-map-re-mapper"

describe("operator-map-re-mapper", () => {
  it("should remap the operator keys", () => {
    const where = {
      prop1: 1,
      prop2: ["test", "test2"],
      prop3: {
        gt: 1,
      },
      prop4: {
        gte: 1,
      },
      prop5: {
        lte: 1,
      },
      prop6: {
        lt: 1,
      },
      prop7: {
        contains: "test",
      },
      prop8: {
        starts_with: "test",
      },
      prop9: {
        ends_with: "test",
      },
    }

    const output = operatorMapReMapper(where)

    expect(output).toEqual({
      prop1: 1,
      prop2: ["test", "test2"],
      prop3: {
        $gt: 1,
      },
      prop4: {
        $gte: 1,
      },
      prop5: {
        $lte: 1,
      },
      prop6: {
        $lt: 1,
      },
      prop7: {
        $like: "%test%",
      },
      prop8: {
        $like: "test%",
      },
      prop9: {
        $like: "%test",
      },
    })
  })

  it("should remap the operator in the case of an or shaped input", () => {
    const andWhere = {
      prop1: 1,
      prop2: ["test", "test2"],
      prop3: {
        gt: 1,
      },
      prop4: {
        gte: 1,
      },
      prop5: {
        lte: 1,
      },
      prop6: {
        lt: 1,
      },
    }
    const where = [andWhere, andWhere]

    const output = operatorMapReMapper(where)

    expect(output).toEqual({
      $or: [andWhere, andWhere].map((i) => operatorMapReMapper(i, false)),
    })
  })
})
