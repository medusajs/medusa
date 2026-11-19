import CloudModuleService, {
  ANNOUNCEMENTS_CACHE_TAG,
  ANNOUNCEMENTS_CACHE_TTL,
  CLOUD_DASHBOARD_URL,
  CLOUD_SIGNUP_URL,
  DEFAULT_CLOUD_API_URL,
} from "../service"
import { CloudAnnouncementPreferences } from "../../../types"

const rawAnnouncement = {
  id: "anno_1",
  title: "Medusa MCP",
  subtitle: "Manage your store from your AI assistant",
  image_url: "https://cdn.medusajs.com/mcp.png",
  content: "<p>Connect your AI assistant.</p>",
  type: "feature",
  link_url: "https://docs.medusajs.com/cloud/mcp",
  plan_handles: [],
  published: true,
  published_at: "2026-10-01T00:00:00.000Z",
}

const logger = { warn: jest.fn() }

const createCachingMock = () => {
  const store = new Map<string, unknown>()

  return {
    computeKey: jest.fn(async (input: object) => JSON.stringify(input)),
    get: jest.fn(async ({ key }: { key: string }) => store.get(key) ?? null),
    set: jest.fn(async ({ key, data }: { key: string; data: object }) => {
      store.set(key, data)
    }),
  }
}

const createService = (
  caching?: ReturnType<typeof createCachingMock>,
  options = {},
  preferences?: Partial<CloudAnnouncementPreferences>
) => {
  const service = new CloudModuleService({ logger, caching } as any, options)
  jest
    .spyOn(service, "listCloudAnnouncementPreferences")
    .mockResolvedValue((preferences ? [preferences] : []) as any)

  return service
}

const mockResponse = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => body }) as Response

describe("CloudModuleService.listAnnouncements", () => {
  let fetchMock: jest.Mock
  let service: CloudModuleService

  beforeEach(() => {
    service = createService()
    fetchMock = jest.fn()
    global.fetch = fetchMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should request the latest announcements from the default Cloud API", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    const announcements = await service.listAnnouncements()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url.origin + url.pathname).toEqual(
      `${DEFAULT_CLOUD_API_URL}/v1/announcements`
    )
    expect(url.searchParams.get("limit")).toEqual("50")
    expect(url.searchParams.get("offset")).toEqual("0")
    expect(url.searchParams.get("order")).toEqual("-published_at")
    expect(init.headers).not.toHaveProperty("x-medusa-organization")
    expect(url.searchParams.has("plan_handle")).toBe(false)
    expect(announcements).toEqual([
      {
        id: "anno_1",
        title: "Medusa MCP",
        subtitle: "Manage your store from your AI assistant",
        content: "<p>Connect your AI assistant.</p>",
        image_url: "https://cdn.medusajs.com/mcp.png",
        type: "feature",
        link_url: "https://docs.medusajs.com/cloud/mcp",
        admin_path: null,
        published_at: "2026-10-01T00:00:00.000Z",
      },
    ])
  })

  it("should filter by the plan when set", async () => {
    fetchMock.mockResolvedValue(mockResponse({ announcements: [] }))

    await createService(undefined, { planHandle: "pro" }).listAnnouncements()

    const [url] = fetchMock.mock.calls[0]
    expect(new URL(url).pathname).toEqual("/v1/announcements")
    expect(new URL(url).searchParams.get("plan_handle")).toEqual("pro")
  })

  it("should request the types of every category when no preferences are set", async () => {
    fetchMock.mockResolvedValue(mockResponse({ announcements: [] }))

    await service.listAnnouncements()

    const [url] = fetchMock.mock.calls[0]
    expect(new URL(url).searchParams.getAll("type[]")).toEqual([
      "security",
      "incident",
      "feature",
      "cloud-feature",
      "admin",
    ])
  })

  it("should only request the types of the enabled categories", async () => {
    fetchMock.mockResolvedValue(mockResponse({ announcements: [] }))

    await createService(
      undefined,
      {},
      { security: true, feature: false, cloud: false }
    ).listAnnouncements()

    const [url] = fetchMock.mock.calls[0]
    expect(new URL(url).searchParams.getAll("type[]")).toEqual([
      "security",
      "incident",
    ])
  })

  it("should not call the Medusa Cloud API when every category is disabled", async () => {
    const announcements = await createService(
      undefined,
      {},
      { security: false, feature: false, cloud: false }
    ).listAnnouncements()

    expect(announcements).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("should link paths to the organization's Medusa Cloud dashboard", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [{ ...rawAnnouncement, link_url: "/settings" }],
      })
    )

    const [announcement] = await createService(undefined, {
      organizationId: "org_123",
    }).listAnnouncements()

    expect(announcement.link_url).toEqual(
      `${CLOUD_DASHBOARD_URL}/org_123/settings`
    )
  })

  it("should link paths to the Medusa Cloud sign-up page without an organization", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [{ ...rawAnnouncement, link_url: "/settings" }],
      })
    )

    const [announcement] = await service.listAnnouncements()

    expect(announcement.link_url).toEqual(CLOUD_SIGNUP_URL)
  })

  it("should keep the admin path only for admin announcements", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [
          {
            id: "anno_1",
            title: "Orders tip",
            type: "admin",
            admin_path: "/orders",
          },
          { id: "anno_2", title: "Any page", type: "admin", admin_path: "" },
          {
            id: "anno_3",
            title: "Feature",
            type: "feature",
            admin_path: "/orders",
          },
        ],
      })
    )

    const announcements = await service.listAnnouncements()

    expect(
      announcements.map(({ type, admin_path }) => ({ type, admin_path }))
    ).toEqual([
      { type: "admin", admin_path: "/orders" },
      { type: "admin", admin_path: null },
      { type: "feature", admin_path: null },
    ])
  })

  it("should drop announcements scheduled for a later date", async () => {
    jest.useFakeTimers({ now: new Date("2026-11-10T12:00:00.000Z") })
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [
          {
            id: "anno_scheduled",
            title: "Scheduled",
            type: "admin",
            published_at: "2026-11-17T12:00:00.000Z",
          },
          {
            id: "anno_published",
            title: "Published",
            type: "security",
            published_at: "2026-11-10T11:00:00.000Z",
          },
          { id: "anno_no_date", title: "No date", type: "cloud-feature" },
        ],
      })
    )

    const announcements = await service.listAnnouncements()
    jest.useRealTimers()

    expect(announcements.map(({ id }) => id)).toEqual([
      "anno_published",
      "anno_no_date",
    ])
  })

  it("should use the configured API URL and organization header", async () => {
    fetchMock.mockResolvedValue(mockResponse({ announcements: [] }))

    await createService(undefined, {
      apiUrl: "https://api.staging.medusajs.cloud/",
      organizationId: "org_123",
    }).listAnnouncements()

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

    const [announcement] = await service.listAnnouncements()

    expect(announcement.link_url).toBeNull()
    expect(announcement.image_url).toBeNull()
  })

  it("should keep http links and images", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        announcements: [
          {
            ...rawAnnouncement,
            link_url: "http://localhost:9000/docs",
            image_url: "http://localhost:9000/image.png",
          },
        ],
      })
    )

    const [announcement] = await service.listAnnouncements()

    expect(announcement.link_url).toEqual("http://localhost:9000/docs")
    expect(announcement.image_url).toEqual("http://localhost:9000/image.png")
  })

  it("should not cache announcements without the Caching Module", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    await service.listAnnouncements()
    await service.listAnnouncements()

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("should cache announcements with the Caching Module", async () => {
    const caching = createCachingMock()
    service = createService(caching)
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    const first = await service.listAnnouncements()
    const second = await service.listAnnouncements()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
    expect(caching.set).toHaveBeenCalledWith(
      expect.objectContaining({
        ttl: ANNOUNCEMENTS_CACHE_TTL,
        tags: [ANNOUNCEMENTS_CACHE_TAG],
      })
    )
  })

  it("should fetch announcements when the cache fails", async () => {
    const caching = createCachingMock()
    caching.get.mockRejectedValue(new Error("Redis is down"))
    caching.set.mockRejectedValue(new Error("Redis is down"))
    service = createService(caching)
    fetchMock.mockResolvedValue(
      mockResponse({ announcements: [rawAnnouncement] })
    )

    const announcements = await service.listAnnouncements()

    expect(announcements).toHaveLength(1)
    expect(logger.warn).toHaveBeenCalledTimes(2)
  })

  it("should throw when the Cloud API responds with an error", async () => {
    fetchMock.mockResolvedValue(mockResponse({}, false, 500))

    await expect(service.listAnnouncements()).rejects.toThrow(
      "Medusa Cloud request to /v1/announcements failed with status 500"
    )
  })
})
