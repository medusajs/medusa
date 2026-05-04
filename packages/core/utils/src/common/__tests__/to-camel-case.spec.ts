import { toCamelCase } from "../to-camel-case"

describe("toCamelCase", function () {
  it("should convert all cases to camel case", function () {
    const expectations = [
      {
        input: "testing-camelize",
        output: "testingCamelize",
      },
      {
        input: "testing-Camelize",
        output: "testingCamelize",
      },
      {
        input: "TESTING-CAMELIZE",
        output: "testingCamelize",
      },
      {
        input: "this_is-A-test",
        output: "thisIsATest",
      },
      {
        input: "this_is-A-test ANOTHER",
        output: "thisIsATestAnother",
      },
      {
        input: "testingAlreadyCamelized",
        output: "testingAlreadyCamelized",
      },
      // Digit-containing PascalCase must round-trip unchanged. Before
      // the regex was relaxed to permit digits, these fell through to
      // the lowercase path and lost the inner uppercase boundary
      // (e.g. `H264Widget` → `h264widget`), which broke
      // MedusaService auto-CRUD container resolution because the
      // entity service registered under one key while the lookup used
      // another. See issue #15280.
      {
        input: "H264Widget",
        output: "H264Widget",
      },
      {
        input: "B2bCustomer",
        output: "B2bCustomer",
      },
      {
        input: "OtpVerification2",
        output: "OtpVerification2",
      },
      // Snake-case + digit input still produces correct PascalCase
      // boundaries — exercises both directions of the function.
      {
        input: "h264_widget",
        output: "h264Widget",
      },
      {
        input: "b2b_customer",
        output: "b2bCustomer",
      },
    ]

    expectations.forEach((expectation) => {
      expect(toCamelCase(expectation.input)).toEqual(expectation.output)
    })
  })
})
