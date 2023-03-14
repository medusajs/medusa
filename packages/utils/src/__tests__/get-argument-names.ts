import { getArgumentNamesFromMethod } from "../get-argument-names"

describe("get argument names from method", () => {
  it("extracts parameter names, given a  simple function", async () => {
    function abc(paramName, config, withValue, optional) {}

    expect(getArgumentNamesFromMethod(abc)).toEqual([
      "paramName",
      "config",
      "withValue",
      "optional",
    ])
  })

  it("extracts parameter names, given a function with default values and optional parameters", async () => {
    function abc(paramName, config, withValue = 124, optional?) {}

    expect(getArgumentNamesFromMethod(abc)).toEqual([
      "paramName",
      "config",
      "withValue",
      "optional",
    ])
  })

  it("extracts parameter names, given a function with objects as default parameter values", async () => {
    function abc(
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) {}

    async function asyncAbc(
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) {}

    expect(getArgumentNamesFromMethod(abc)).toEqual([
      "paramName",
      "withValue",
      "optional",
    ])

    expect(getArgumentNamesFromMethod(asyncAbc)).toEqual([
      "paramName",
      "withValue",
      "optional",
    ])
  })

  it("extracts parameter names, given an anonymous function with objects as default parameter values", async () => {
    const abc = function (
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) {}

    const asyncAbc = async function (
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) {}

    expect(getArgumentNamesFromMethod(abc)).toEqual([
      "paramName",
      "withValue",
      "optional",
    ])

    expect(getArgumentNamesFromMethod(asyncAbc)).toEqual([
      "paramName",
      "withValue",
      "optional",
    ])
  })

  it("extracts parameter names, given an arrow function with objects as default parameter values", async () => {
    const abc = (
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) => {}

    const asyncAbc = async (
      paramName = { subParam: 123, abc: 2 },
      withValue = 124,
      optional?
    ) => {}

    expect(getArgumentNamesFromMethod(asyncAbc)).toEqual([
      "paramName",
      "withValue",
      "optional",
    ])
  })
})
