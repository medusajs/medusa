import { transformIdableFields } from "../transform-idable-fields"

describe("transformIdableFields", () => {
  test("one field", () => {
    const test = {
      shipping_address: "test_id",
    }

    const result = transformIdableFields(test, ["shipping_address"])

    expect(test).toEqual(test)

    expect(result).toEqual({
      shipping_address_id: "test_id",
    })
  })

  test("duplicate field", () => {
    const test = {
      shipping_address: "test_id",
      shipping_address_id: "something else",
    }

    const result = transformIdableFields(test, ["shipping_address"])

    expect(test).toEqual(test)

    expect(result).toEqual({
      shipping_address_id: "test_id",
    })
  })

  test("many fields", () => {
    const test = {
      shipping_address: "test_id",
      customer: "cus_test",
      region: "reg_test",
      something: "else",
    }

    const result = transformIdableFields(test, [
      "shipping_address",
      "customer",
      "region",
    ])

    expect(test).toEqual(test)

    expect(result).toEqual({
      shipping_address_id: "test_id",
      customer_id: "cus_test",
      region_id: "reg_test",
      something: "else",
    })
  })

  test("mix fields", () => {
    const test = {
      shipping_address: {
        address_1: "my home",
      },
      customer: "cus_test",
      region: "reg_test",
      something: "else",
    }

    const result = transformIdableFields(test, [
      "shipping_address",
      "customer",
      "region",
    ])

    expect(test).toEqual(test)

    expect(result).toEqual({
      shipping_address: {
        address_1: "my home",
      },
      customer_id: "cus_test",
      region_id: "reg_test",
      something: "else",
    })
  })

  test("no fields", () => {
    const test = {
      something: "else",
      and: "more",
      maybe: "one more",
    }

    const result = transformIdableFields(test, [
      "shipping_address",
      "customer",
      "region",
    ])

    expect(test).toEqual(test)
    expect(result).toEqual({
      something: "else",
      and: "more",
      maybe: "one more",
    })
  })
})
