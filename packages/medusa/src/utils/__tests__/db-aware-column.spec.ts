import { resolveDbType } from "../db-aware-column"
import { expect, describe, jest, beforeEach, it } from "@jest/globals"
const runLoadTest = async (testFixtureFileName: string) => {
  const pgType = resolveDbType(
    "string",
    `${__dirname}/../__fixtures__/`,
    `${testFixtureFileName}.js`
  )
  expect(pgType).toBe("string")
}

describe("async load tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it("should async load medusa-config with non-async", async () => {
    await runLoadTest("default-case-non-async-data")
  })

  it("should async load medusa-config with async data", async () => {
    await runLoadTest("async-parameter")
  })
  it("should async load medusa-config with async function promising non-async data", async () => {
    await runLoadTest("async-function-with-non-async-data")
  })
  it("should async load medusa-config with async function promising async data", async () => {
    await runLoadTest("async-function-with-async-parameter")
  })
})
