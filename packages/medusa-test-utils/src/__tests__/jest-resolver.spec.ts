import resolver from "../jest-resolver"

describe("jest resolver", () => {
  const notFound = new Error("Cannot find module")

  it("returns the default resolution when it succeeds", () => {
    const defaultResolver = jest
      .fn()
      .mockReturnValue("/app/node_modules/express/index.js")

    expect(
      resolver("express", { conditions: ["require"], defaultResolver })
    ).toEqual("/app/node_modules/express/index.js")
    expect(defaultResolver).toHaveBeenCalledTimes(1)
  })

  it("retries with the import condition when the default resolution fails", () => {
    const defaultResolver = jest
      .fn()
      .mockImplementationOnce(() => {
        throw notFound
      })
      .mockReturnValueOnce(
        "/app/node_modules/connect-redis/dist/connect-redis.js"
      )

    expect(
      resolver("connect-redis", { conditions: ["require"], defaultResolver })
    ).toEqual("/app/node_modules/connect-redis/dist/connect-redis.js")
    expect(defaultResolver).toHaveBeenLastCalledWith(
      "connect-redis",
      expect.objectContaining({ conditions: ["require", "import"] })
    )
  })

  it("throws the original error when both resolutions fail", () => {
    const defaultResolver = jest
      .fn()
      .mockImplementationOnce(() => {
        throw notFound
      })
      .mockImplementationOnce(() => {
        throw new Error("other")
      })

    expect(() =>
      resolver("missing", { conditions: ["require"], defaultResolver })
    ).toThrow(notFound)
  })
})
