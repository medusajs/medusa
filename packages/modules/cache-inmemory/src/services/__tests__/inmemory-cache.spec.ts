import InMemoryCacheService from "../inmemory-cache"

const build = async (keys: string[]) => {
  const cache = new InMemoryCacheService({} as any, {})
  for (const key of keys) {
    await cache.set(key, key, 600)
  }
  return cache
}

const survivors = async (cache: InMemoryCacheService, keys: string[]) => {
  const out: string[] = []
  for (const key of keys) {
    if ((await cache.get(key)) !== null) {
      out.push(key)
    }
  }
  return out
}

describe("InMemoryCacheService", () => {
  describe("get / set", () => {
    it("round-trips a value", async () => {
      const cache = await build(["a"])
      expect(await cache.get("a")).toEqual("a")
    })

    it("returns null for a key that was never set", async () => {
      const cache = await build([])
      expect(await cache.get("nope")).toBeNull()
    })
  })

  describe("invalidate", () => {
    it("removes an exact key and leaves the rest", async () => {
      const keys = ["a", "b"]
      const cache = await build(keys)

      await cache.invalidate("a")

      expect(await survivors(cache, keys)).toEqual(["b"])
    })

    it("removes every key covered by a trailing wildcard", async () => {
      const keys = ["ps:1", "ps:2", "other:1"]
      const cache = await build(keys)

      await cache.invalidate("ps:*")

      expect(await survivors(cache, keys)).toEqual(["other:1"])
    })

    /**
     * The pattern describes a whole key. Unanchored, it matches anywhere in the
     * string, so `ps:*` also reaches keys that merely contain `ps:`.
     */
    it("does not remove keys that only contain the pattern", async () => {
      const keys = ["ps:1", "tenant:ps:1"]
      const cache = await build(keys)

      await cache.invalidate("ps:*")

      expect(await survivors(cache, keys)).toEqual(["tenant:ps:1"])
    })

    /**
     * `String.replace` with a string pattern substitutes the first occurrence
     * only, so a second `*` survives into the expression as a quantifier on the
     * character before it rather than as a wildcard.
     */
    it("treats every asterisk as a wildcard, not just the first", async () => {
      const keys = ["a-X-c", "a-X-b-Y-c"]
      const cache = await build(keys)

      await cache.invalidate("a*b*c")

      expect(await survivors(cache, keys)).toEqual(["a-X-c"])
    })

    /**
     * Cache keys are arbitrary application data and regularly carry characters
     * that mean something to a regular expression.
     */
    it("matches a dot literally rather than as any character", async () => {
      const keys = ["ps:v1.0:a", "ps:v1X0:a"]
      const cache = await build(keys)

      await cache.invalidate("ps:v1.0:*")

      expect(await survivors(cache, keys)).toEqual(["ps:v1X0:a"])
    })

    it("matches bracket characters literally", async () => {
      const keys = ["cart[1]:a", "cart1:a"]
      const cache = await build(keys)

      await cache.invalidate("cart[1]:*")

      expect(await survivors(cache, keys)).toEqual(["cart1:a"])
    })

    it("does not throw on a key containing an unbalanced bracket", async () => {
      const keys = ["cart[1:a", "cart[2:a"]
      const cache = await build(keys)

      await expect(cache.invalidate("cart[1:*")).resolves.toBeUndefined()
      expect(await survivors(cache, keys)).toEqual(["cart[2:a"])
    })

    it("matches regex quantifier characters literally", async () => {
      const keys = ["a+b:1", "aab:1"]
      const cache = await build(keys)

      await cache.invalidate("a+b:*")

      expect(await survivors(cache, keys)).toEqual(["aab:1"])
    })
  })
})
