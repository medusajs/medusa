import { Logger } from "@medusajs/framework/types"
import { MemoryCachingProvider } from "../memory-cache"

const loggerMock = {
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

const createProvider = (maxSize: number) => {
  return new MemoryCachingProvider(
    { logger: loggerMock, hasher: (key) => `hash:${key}` },
    { maxSize }
  )
}

// The size guard is evaluated before an entry is added, so the second write is
// accepted and leaves the tracked usage above maxSize.
const fillPastMaxSize = async (provider: MemoryCachingProvider) => {
  await provider.set({ key: "a", data: { d: "A".repeat(600) }, tags: ["t-a"] })
  await provider.set({ key: "b", data: { d: "B".repeat(600) }, tags: ["t-b"] })
}

describe("MemoryCachingProvider clear with the wildcard tag", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("accepts new entries again once the cache has been emptied", async () => {
    const provider = createProvider(1000)
    await fillPastMaxSize(provider)

    await provider.clear({ tags: ["*"] })
    await provider.set({ key: "after-clear", data: { small: true } })

    expect(await provider.get({ key: "after-clear" })).toEqual({ small: true })
    expect(loggerMock.warn).not.toHaveBeenCalled()
  })

  it("still removes every entry and its tag index", async () => {
    const provider = createProvider(1000)
    await fillPastMaxSize(provider)

    await provider.clear({ tags: ["*"] })

    expect(await provider.get({ key: "a" })).toBeNull()
    expect(await provider.get({ key: "b" })).toBeNull()
    expect(await provider.get({ tags: ["t-a"] })).toEqual([])
  })
})
