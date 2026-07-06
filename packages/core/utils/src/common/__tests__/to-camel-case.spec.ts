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
