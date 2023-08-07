import { FlagRouter } from "../flag-router"

const someFlag = {
  key: "some_flag",
  default_val: false,
  env_key: "MEDUSA_FF_SOME_FLAG",
  description: "[WIP] Enable some flag",
}

const workflows = {
  key: "workflows",
  default_val: {},
  env_key: "MEDUSA_FF_WORKFLOWS",
  description: "[WIP] Enable workflows",
}

describe("FlagRouter", function () {
  it("should set a top-level flag", async function () {
    const flagRouter = new FlagRouter({})

    flagRouter.setFlag(someFlag.key, true)

    expect(flagRouter.listFlags()).toEqual([
      {
        key: someFlag.key,
        value: true,
      },
    ])
  })

  it("should set a nested flag", async function () {
    const flagRouter = new FlagRouter({})

    flagRouter.setFlag(workflows.key, { createCart: true })

    expect(flagRouter.listFlags()).toEqual([
      {
        key: workflows.key,
        value: {
          createCart: true,
        },
      },
    ])
  })

  it("should append to a nested flag", async function () {
    const flagRouter = new FlagRouter({})

    flagRouter.setFlag(workflows.key, { createCart: true })
    flagRouter.setFlag(workflows.key, { addShippingMethod: true })

    expect(flagRouter.listFlags()).toEqual([
      {
        key: workflows.key,
        value: {
          createCart: true,
          addShippingMethod: true,
        },
      },
    ])
  })

  it("should check if top-level flag is enabled", async function () {
    const flagRouter = new FlagRouter({
      [someFlag.key]: true,
    })

    const isEnabled = flagRouter.isFeatureEnabled(someFlag.key)

    expect(isEnabled).toEqual(true)
  })

  it("should check if nested flag is enabled", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: {
        createCart: true,
      },
    })

    const isEnabled = flagRouter.isFeatureEnabled({ workflows: "createCart" })

    expect(isEnabled).toEqual(true)
  })

  it("should check if nested flag is enabled using top-level access", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: {
        createCart: true,
      },
    })

    const isEnabled = flagRouter.isFeatureEnabled(workflows.key)

    expect(isEnabled).toEqual(true)
  })

  it("should return true if top-level is enabled using nested-level access", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: true,
    })

    const isEnabled = flagRouter.isFeatureEnabled({
      [workflows.key]: "createCart",
    })

    expect(isEnabled).toEqual(true)
  })

  it("should return false if flag is disabled using top-level access", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: false,
    })

    const isEnabled = flagRouter.isFeatureEnabled(workflows.key)

    expect(isEnabled).toEqual(false)
  })

  it("should return false if nested flag is disabled", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: {
        createCart: false,
      },
    })

    const isEnabled = flagRouter.isFeatureEnabled({ workflows: "createCart" })

    expect(isEnabled).toEqual(false)
  })

  it("should initialize with both types of flags", async function () {
    const flagRouter = new FlagRouter({
      [workflows.key]: {
        createCart: true,
      },
      [someFlag.key]: true,
    })

    const flags = flagRouter.listFlags()

    expect(flags).toEqual([
      {
        key: workflows.key,
        value: {
          createCart: true,
        },
      },
      {
        key: someFlag.key,
        value: true,
      },
    ])
  })
})
