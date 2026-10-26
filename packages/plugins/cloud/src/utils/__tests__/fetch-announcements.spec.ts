import {
  ANNOUNCEMENTS_CACHE_TTL_MS,
  clearAnnouncementsCache,
  DEFAULT_CLOUD_API_URL,
  fetchAnnouncements,
} from "../fetch-announcements"

const rawAnnouncement = {
  id: "anno_1",
  title: "Medusa MCP",
  subtitle: "Manage your store from your AI assistant",
  image_url: "https://cdn.medusajs.com/mcp.png",
  content: "<p>Should not be forwarded</p>",
  type: "feature",
  link_url: "https://docs.medusajs.com/cloud/mcp",
  plan_handles: [],
  published: true,
  published_at: "2026-10-01T00:00:00.000Z",
}

const mockResponse = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => body } as Response)

describe("fetchAnnouncements", () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    clearAnnouncementsCache()
    fetchMock = jest.fn()
    global.fetch = fetchMock
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should request the latest announcements from the default Cloud API", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    const announcements = await fetchAnnouncements()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url.toString()).toEqual(
      `${DEFAULT_CLOUD_API_URL}/v1/announcements?limit=10&offset=0&order=-published_at`
    )
    expect(init.headers).not.toHaveProperty("x-medusa-organization")
    expect(announcements).toEqual([
      {
        id: "anno_1",
        title: "Medusa MCP",
        subtitle: "Manage your store from your AI assistant",
        image_url: "https://cdn.medusajs.com/mcp.png",
        type: "feature",
        link_url: "https://docs.medusajs.com/cloud/mcp",
        published_at: "2026-10-01T00:00:00.000Z",
      },
    ])
  })

  it("should use the configured API URL and organization header", async () => {
    fetchMock.mockResolvedValue(mockResponse({ announcements: [] }))

    await fetchAnnouncements({
      apiUrl: "https://api.staging.medusajs.cloud/",
      organizationId: "org_123",
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url.toString()).toContain(
      "https://api.staging.medusajs.cloud/v1/announcements?"
    )
    expect(init.headers["x-medusa-organization"]).toEqual("org_123")
  })

  it("should drop links and images that aren't http(s) URLs", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [
          {
            ...rawAnnouncement,
            link_url: "javascript:alert(1)",
            image_url: "data:image/png;base64,abc",
          },
        ],
      })
    )

    const [announcement] = await fetchAnnouncements()

    expect(announcement.link_url).toBeNull()
    expect(announcement.image_url).toBeNull()
  })

  it("should cache announcements until the TTL expires", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-26T00:00:00.000Z") })
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    await fetchAnnouncements()
    await fetchAnnouncements()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    jest.setSystemTime(Date.now() + ANNOUNCEMENTS_CACHE_TTL_MS + 1)
    await fetchAnnouncements()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("should throw when the Cloud API responds with an error", async () => {
    fetchMock.mockResolvedValue(mockResponse({}, false, 500))

    await expect(fetchAnnouncements()).rejects.toThrow(
      "Medusa Cloud announcements request failed with status 500"
    )
  })
})
