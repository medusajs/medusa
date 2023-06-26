import { toCamelCase } from "../to-camel-case"

describe("toCamelCase", function () {
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
    }, {
      input: 'Testing',
      output: 'testing'
    }, {
      input: 'TESTING',
      output: 'testing'
    }, {
      input: 't',
      output: 't'
    }, {
      input: '',
      output: ''
    }]

    expectations.forEach(expectation => {
      expect(toCamelCase(expectation.input)).toEqual(expectation.output)
    })
  })
})
