import { upperCaseFirst } from "../upper-case-first"

describe("upperCaseFirst", function () {
  it("should convert first letter of the word to capital letter", function () {
    const expectations = [
      {
        input: "testing capitalize",
        output: "Testing capitalize",
      },
      {
        input: "testing",
        output: "Testing",
      },
      {
        input: "Testing",
        output: "Testing",
      },
      {
        input: "TESTING",
        output: "TESTING",
      },
      {
        input: "t",
        output: "T",
      },
      {
        input: "",
        output: "",
      },
    ]

    expectations.forEach((expectation) => {
      expect(upperCaseFirst(expectation.input)).toEqual(expectation.output)
    })
  })
})
