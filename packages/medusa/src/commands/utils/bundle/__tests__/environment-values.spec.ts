import { environmentValues, findEnvironmentValue } from "../environment-values"

const env = {
  DATABASE_URL: "postgres://user:hunter2hunter2@db.internal:5432/app",
  WEBHOOK_TARGET: "https://hooks.example.com/orders",
  NODE_ENV: "production",
  PORT: "9000",
  EMPTY: "",
  UNSET: undefined,
}

describe("environmentValues", () => {
  it("lists every variable that has a value", () => {
    expect(environmentValues(env).map(({ name }) => name)).toEqual([
      "DATABASE_URL",
      "WEBHOOK_TARGET",
      "NODE_ENV",
      "PORT",
    ])
  })
})

describe("findEnvironmentValue", () => {
  const values = environmentValues(env)

  it("finds a string that is a variable's value, and says where", () => {
    expect(
      findEnvironmentValue(
        { event: "order.placed", context: { target: [env.WEBHOOK_TARGET] } },
        values
      )
    ).toEqual({ name: "WEBHOOK_TARGET", at: "context.target[0]" })
  })

  it("finds a key that is a variable's value", () => {
    expect(findEnvironmentValue({ [env.DATABASE_URL]: 1 }, values)?.name).toBe(
      "DATABASE_URL"
    )
  })

  it("compares whole strings only", () => {
    expect(
      findEnvironmentValue(
        {
          entity: "ProductionOrder",
          note: "runs in production",
          limit: 9000,
          empty: "",
        },
        values
      )
    ).toBeUndefined()
    expect(findEnvironmentValue({ mode: "production" }, values)).toEqual({
      name: "NODE_ENV",
      at: "mode",
    })
  })
})
