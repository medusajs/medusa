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
})
