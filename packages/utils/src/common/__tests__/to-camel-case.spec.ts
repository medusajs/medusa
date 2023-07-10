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
    ]

    expectations.forEach((expectation) => {
      expect(toCamelCase(expectation.input)).toEqual(expectation.output)
    })
  })
})
