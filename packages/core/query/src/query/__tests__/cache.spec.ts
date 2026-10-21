import { RemoteJoinerOptions } from "@medusajs/types"
import { queryCacheDecoratorOptions } from "../cache"
import type { Query } from "../query"

type CacheOptions = NonNullable<RemoteJoinerOptions["cache"]>

function createArgs(options?: RemoteJoinerOptions): Parameters<Query["graph"]> {
  return [{ entity: "product", fields: ["id", "title"] }, options]
}

describe("localized query cache dependencies", () => {
  it.each<{
    name: string
    cache: CacheOptions
    automatic: boolean | undefined
    tags: string[]
  }>([
    { name: "default options", cache: {}, automatic: true, tags: [] },
    {
      name: "automatic tags enabled without custom tags",
      cache: { computeAutomaticTags: true },
      automatic: true,
      tags: [],
    },
    {
      name: "automatic flag has no effect without custom tags",
      cache: { computeAutomaticTags: false },
      automatic: true,
      tags: [],
    },
    {
      name: "custom tags",
      cache: { tags: ["Custom:list:*"] },
      automatic: undefined,
      tags: ["Custom:list:*"],
    },
    {
      name: "custom tags with automatic tags enabled",
      cache: { tags: ["Custom:list:*"], computeAutomaticTags: true },
      automatic: true,
      tags: ["Custom:list:*"],
    },
    {
      name: "custom tags with automatic tags disabled",
      cache: { tags: ["Custom:list:*"], computeAutomaticTags: false },
      automatic: false,
      tags: ["Custom:list:*"],
    },
    {
      name: "an explicit empty tag array",
      cache: { tags: [] },
      automatic: undefined,
      tags: [],
    },
    {
      name: "an existing translation dependency",
      cache: { tags: ["Translation:list:*"] },
      automatic: undefined,
      tags: [],
    },
  ])(
    "preserves the caller's policy with $name",
    ({ cache, automatic, tags }) => {
      const args = createArgs({ locale: "fr-FR", cache })

      expect(queryCacheDecoratorOptions.tags(args)).toEqual([
        ...tags,
        "Translation:list:*",
      ])
      expect(queryCacheDecoratorOptions.computeAutomaticTags(args)).toBe(
        automatic
      )
    }
  )

  it("resolves a localized tag callback once regardless of resolver order", () => {
    const tags = jest.fn(() => ["Custom:list:*"])
    const args = createArgs({ locale: "fr-FR", cache: { tags } })

    expect(
      queryCacheDecoratorOptions.computeAutomaticTags(args)
    ).toBeUndefined()
    expect(queryCacheDecoratorOptions.tags(args)).toEqual([
      "Custom:list:*",
      "Translation:list:*",
    ])
    expect(tags).toHaveBeenCalledTimes(1)
    expect(tags).toHaveBeenCalledWith(args)
  })

  it("retains automatic tags when a callback returns no custom tags", () => {
    const tags = jest.fn(() => undefined)
    const args = createArgs({
      locale: "fr-FR",
      cache: { tags, computeAutomaticTags: false },
    })

    expect(queryCacheDecoratorOptions.tags(args)).toEqual([
      "Translation:list:*",
    ])
    expect(queryCacheDecoratorOptions.computeAutomaticTags(args)).toBe(true)
    expect(tags).toHaveBeenCalledTimes(1)
  })

  it("evaluates callbacks again for a new invocation with the same options", () => {
    const tags = jest
      .fn()
      .mockReturnValueOnce(["First"])
      .mockReturnValueOnce([])
    const options = { locale: "fr-FR", cache: { tags } }

    expect(queryCacheDecoratorOptions.tags(createArgs(options))).toEqual([
      "First",
      "Translation:list:*",
    ])
    expect(queryCacheDecoratorOptions.tags(createArgs(options))).toEqual([
      "Translation:list:*",
    ])
    expect(tags).toHaveBeenCalledTimes(2)
  })

  it("does not mutate frozen caller options or tag arrays", () => {
    const tags = ["Custom:list:*"]
    const options = { locale: "fr-FR", cache: { tags } }
    Object.freeze(tags)
    Object.freeze(options.cache)
    Object.freeze(options)

    expect(queryCacheDecoratorOptions.tags(createArgs(options))).toEqual([
      "Custom:list:*",
      "Translation:list:*",
    ])
    expect(tags).toEqual(["Custom:list:*"])
  })

  it("keeps explicit automatic-invalidation opt-out", () => {
    const args = createArgs({
      locale: "fr-FR",
      cache: { enable: true, autoInvalidate: false },
    })

    expect(queryCacheDecoratorOptions.autoInvalidate(args)).toBe(false)
    expect(queryCacheDecoratorOptions.tags(args)).toEqual([
      "Translation:list:*",
    ])
  })

  it("does not enable caching for a locale alone", () => {
    expect(
      queryCacheDecoratorOptions.enable(createArgs({ locale: "fr-FR" }))
    ).toBeFalsy()
  })

  it("keeps caching disabled when explicitly requested", () => {
    const args = createArgs({
      locale: "fr-FR",
      cache: { enable: false, tags: ["Custom:list:*"] },
    })

    expect(queryCacheDecoratorOptions.enable(args)).toBe(false)
  })

  it.each([undefined, {}, { locale: undefined }, { locale: "" }])(
    "does not add dependencies without a locale: %j",
    (options) => {
      const args = createArgs(options)
      expect(queryCacheDecoratorOptions.tags(args)).toBeUndefined()
      expect(
        queryCacheDecoratorOptions.computeAutomaticTags(args)
      ).toBeUndefined()
    }
  )

  it("passes non-localized custom policies through unchanged", () => {
    const tags = ["Custom:list:*"]
    const args = createArgs({ cache: { tags, computeAutomaticTags: false } })

    expect(queryCacheDecoratorOptions.tags(args)).toBe(tags)
    expect(queryCacheDecoratorOptions.computeAutomaticTags(args)).toBe(false)
  })

  it("does not evaluate localized tag callbacks when caching is explicitly disabled", () => {
    const tags = jest.fn(() => {
      throw new Error("Disabled cache must not evaluate tags")
    })
    const args = createArgs({ locale: "fr-FR", cache: { enable: false, tags } })

    queryCacheDecoratorOptions.tags(args)
    queryCacheDecoratorOptions.computeAutomaticTags(args)
    expect(tags).not.toHaveBeenCalled()
  })
})
