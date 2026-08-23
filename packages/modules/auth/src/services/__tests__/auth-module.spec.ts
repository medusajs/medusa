import AuthModuleService from "../auth-module"

const buildProviderService = (cache?: unknown) => {
  const service = new AuthModuleService({ cache } as any, {} as any)
  return service.getAuthIdentityProviderService("google")
}

describe("AuthModuleService", () => {
  describe("getAuthIdentityProviderService - setState", () => {
    it("should resolve only once the state has been written to the cache", async () => {
      let completeWrite: () => void = () => {}
      const cache = {
        set: jest.fn().mockImplementation(
          () =>
            new Promise<void>((resolve) => {
              completeWrite = resolve
            })
        ),
      }

      const providerService = buildProviderService(cache)

      let settled = false
      const setStatePromise = providerService
        .setState("auth_state_key", { redirect_url: "http://localhost" })
        .then(() => {
          settled = true
        })

      // Give the promise chain a chance to settle. It must not, since the
      // pending cache write has to be awaited before setState resolves.
      await Promise.resolve()
      await Promise.resolve()
      expect(settled).toBe(false)

      completeWrite()
      await setStatePromise

      expect(settled).toBe(true)
    })

    it("should store the state with a default ttl of 20 minutes", async () => {
      const cache = { set: jest.fn().mockResolvedValue(undefined) }

      await buildProviderService(cache).setState("auth_state_key", {
        redirect_url: "http://localhost",
      })

      expect(cache.set).toHaveBeenCalledWith(
        "auth_state_key",
        { redirect_url: "http://localhost" },
        1200
      )
    })

    it("should store the state with the provided ttl", async () => {
      const cache = { set: jest.fn().mockResolvedValue(undefined) }

      await buildProviderService(cache).setState(
        "auth_state_key",
        { redirect_url: "http://localhost" },
        60
      )

      expect(cache.set).toHaveBeenCalledWith(
        "auth_state_key",
        { redirect_url: "http://localhost" },
        60
      )
    })

    it("should propagate a failing cache write instead of swallowing it", async () => {
      const cache = {
        set: jest.fn().mockRejectedValue(new Error("Redis is unreachable")),
      }

      await expect(
        buildProviderService(cache).setState("auth_state_key", {
          redirect_url: "http://localhost",
        })
      ).rejects.toThrow("Redis is unreachable")
    })

    it("should throw when no cache module is registered", async () => {
      await expect(
        buildProviderService(undefined).setState("auth_state_key", {})
      ).rejects.toThrow(
        "Cache module dependency is required when using OAuth providers that require state"
      )
    })
  })
})
