import {
  CloudServiceError,
  MedusaSearchClient,
  resolveMedusaSearchOptions,
} from "../client"

describe("MedusaSearchClient", () => {
  it("should surface a rate limit with the wait Cloud asked for", async () => {
    const fetchImpl = jest.fn(async () => ({
      ok: false,
      status: 429,
      headers: { get: () => "7" },
      json: async () => ({
        type: "embedding_rate_limit",
        message: "Embedding provider is rate limiting requests",
      }),
    }))

    const client = new MedusaSearchClient(
      {
        api_key: "medusa_test",
        endpoint: "https://search.medusa.example",
        environment_handle: "test-env",
      },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    )

    const error = await client
      .index("product")
      .write({ upsert_rows: [] } as any)
      .catch((caught) => caught)

    expect(error).toBeInstanceOf(CloudServiceError)
    expect(error.status).toBe(429)
    expect(error.type).toBe("embedding_rate_limit")
    // Seconds on the wire, milliseconds for the backoff that reads it.
    expect(error.retry_after).toBe(7_000)
  })
})

describe("MedusaSearchClient authentication", () => {
  it("should send only the key as the auth header, with the handle on its own", async () => {
    const fetchImpl = jest.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({}),
    }))

    const client = new MedusaSearchClient(
      resolveMedusaSearchOptions({
        endpoint: "https://test-env:medusa_token@search.medusa.example",
      }),
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    )

    await client.index("product").metadata()

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit
    ]
    expect(url).toBe("https://search.medusa.example/indexes/product/metadata")
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Basic medusa_token"
    )
    expect(
      (init.headers as Record<string, string>)["x-medusa-environment-handle"]
    ).toBe("test-env")
  })
})

describe("resolveMedusaSearchOptions", () => {
  it("should read the environment handle and token off a basic auth endpoint", () => {
    const resolved = resolveMedusaSearchOptions({
      endpoint: "https://test-env:medusa_token@search.medusa.example",
    })

    expect(resolved).toEqual({
      api_key: "medusa_token",
      endpoint: "https://search.medusa.example",
      environment_handle: "test-env",
    })
  })

  it("should keep using the explicit options for an endpoint without credentials", () => {
    const resolved = resolveMedusaSearchOptions({
      api_key: "medusa_test",
      endpoint: "https://search.medusa.example",
      environment_handle: "test-env",
    })

    expect(resolved.api_key).toBe("medusa_test")
    expect(resolved.endpoint).toBe("https://search.medusa.example")
    expect(resolved.environment_handle).toBe("test-env")
  })

  it("should throw when the endpoint and the explicit options both carry credentials", () => {
    expect(() =>
      resolveMedusaSearchOptions({
        api_key: "medusa_test",
        endpoint: "https://test-env:medusa_token@search.medusa.example",
      })
    ).toThrow(/Pass only one of them/)

    expect(() =>
      resolveMedusaSearchOptions({
        endpoint: "https://test-env:medusa_token@search.medusa.example",
        environment_handle: "other-env",
      })
    ).toThrow(/Pass only one of them/)
  })
})
