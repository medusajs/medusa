import { CloudServiceError, MedusaSearchClient } from "../client"

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
