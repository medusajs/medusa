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

describe("resolveMedusaSearchOptions", () => {
  it("should move basic auth credentials off the endpoint and into the key", () => {
    const resolved = resolveMedusaSearchOptions({
      endpoint: "https://medusa_test:secret@search.medusa.example",
      environment_handle: "test-env",
    })

    expect(resolved).toEqual({
      api_key: Buffer.from("medusa_test:secret").toString("base64"),
      endpoint: "https://search.medusa.example",
      environment_handle: "test-env",
    })
  })

  it("should keep using the api_key option for an endpoint without credentials", () => {
    const resolved = resolveMedusaSearchOptions({
      api_key: "medusa_test",
      endpoint: "https://search.medusa.example",
      environment_handle: "test-env",
    })

    expect(resolved.api_key).toBe("medusa_test")
    expect(resolved.endpoint).toBe("https://search.medusa.example")
  })

  it("should throw when the endpoint and the api_key option both carry credentials", () => {
    expect(() =>
      resolveMedusaSearchOptions({
        api_key: "medusa_option",
        endpoint: "https://medusa_endpoint:secret@search.medusa.example",
        environment_handle: "test-env",
      })
    ).toThrow(/Pass only one of them/)
  })
})
