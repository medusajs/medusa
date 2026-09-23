import { deepEqualObj } from "../deep-equal-obj"

describe("deepEqualObj", function () {
  it("should return true if objects are equal", function () {
    const object1 = {
      foo: "bar",
      bar: "foo",
      xar: { foo: "bar", wor: { bar: "foo", ror: ["test", "test1"] } },
    }
    const object2 = {
      foo: "bar",
      bar: "foo",
      xar: { foo: "bar", wor: { bar: "foo", ror: ["test", "test1"] } },
    }

    expect(deepEqualObj(object1, object2)).toBe(true)
  })

  it("should return false if objects are not equal", function () {
    const object1 = {
      foo: "bar",
      bar: "foo",
      xar: { foo: "bar", wor: { bar: "foo", ror: ["test", "test1"] } },
    }
    const object2 = {
      foo: "bar",
      bar: "foo",
      xar: { foo: "bar", wor: { bar: "foo", ror: ["test", "test1_"] } },
    }

    expect(deepEqualObj(object1, object2)).toBe(false)
  })

  it("should compare Date values by time, not by their (empty) keys", function () {
    expect(deepEqualObj(new Date(0), new Date(0))).toBe(true)
    expect(deepEqualObj(new Date(0), new Date(999999))).toBe(false)
    expect(
      deepEqualObj({ created_at: new Date(0) }, { created_at: new Date(0) })
    ).toBe(true)
    expect(
      deepEqualObj({ created_at: new Date(0) }, { created_at: new Date(999999) })
    ).toBe(false)
    // a Date is not equal to a plain object
    expect(deepEqualObj(new Date(0), {})).toBe(false)
  })
})
