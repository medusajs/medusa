import { parseStringifyIfNecessary } from "../parse-stringify-if-necessary"

describe("parseStringifyIfNecessary", () => {
  it("keeps the message, name and stack of errors", () => {
    const error = Object.assign(new Error("boom"), { code: "E_BOOM" })

    const copy = parseStringifyIfNecessary({ errors: [{ error }] })

    expect(copy.errors[0].error).toEqual({
      name: "Error",
      message: "boom",
      stack: error.stack,
      code: "E_BOOM",
    })
  })
})
