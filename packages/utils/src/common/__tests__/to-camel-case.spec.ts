import { kebabToCamelCase } from "../kebab-to-camel-case"

describe("kebabToCamelCase", function () {
  it("should convert kebab case to camel case", function () {
    const expectations = [{
      input: 'testing-camelize',
      output: 'testingCamelize'
    }, {
      input: 'testing-Camelize',
      output: 'testingCamelize'
    }, {
      input: 'TESTING-CAMELIZE',
      output: 'testingCamelize'
    }]

    expectations.forEach(expectation => {
      expect(kebabToCamelCase(expectation.input)).toEqual(expectation.output)
    })
  })
})
