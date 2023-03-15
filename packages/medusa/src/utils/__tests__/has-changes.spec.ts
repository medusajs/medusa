import { hasChanges } from "../has-changes"

describe("hasChanges", function () {
  it("should return true the data differ and false otherwise", () => {
    const objToCompareTo = {
      prop1: "test",
      prop2: "test",
      prop3: "test",
      prop4: {
        prop4_1: "test",
        prop4_2: "test",
        prop4_3: "test",
      },
    }

    const obj = {
      prop1: "test",
      prop2: "test",
      prop3: "test",
      prop4: {
        prop4_1: "test",
        prop4_2: "test",
        prop4_3: "test",
      },
    }

    let res = hasChanges(objToCompareTo, obj)
    expect(res).toBeFalsy()

    const obj2 = {
      ...obj,
      prop3: "tes",
    }

    res = hasChanges(objToCompareTo, obj2)
    expect(res).toBeTruthy()

    const obj3 = {
      ...obj,
      prop4: {
        prop4_1: "",
        prop4_2: "test",
        prop4_3: "test",
      },
    }

    res = hasChanges(objToCompareTo, obj3)
    expect(res).toBeTruthy()

    const obj4 = {
      ...obj,
    }
    /* @ts-ignore */
    delete obj4.prop4

    res = hasChanges(objToCompareTo, obj4)
    expect(res).toBeFalsy()
  })
})
