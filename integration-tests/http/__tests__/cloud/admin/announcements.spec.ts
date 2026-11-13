import { ICachingModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

const CLOUD_API_URL = "http://cloud-api.test"

const rawAnnouncements = [
  {
    id: "anno_feature",
    title: "Medusa MCP",
    subtitle: "Manage your store from your AI assistant",
    content: "<p>Connect your AI assistant.</p>",
    type: "feature",
    link_url: "/settings",
    plan_handles: [],
    published: true,
    published_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "anno_admin",
    title: "Ask AI about your orders",
    type: "admin",
    admin_path: "/orders",
    published: true,
    published_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "anno_scheduled",
    title: "Scheduled",
    type: "security",
    published: true,
    published_at: "2999-01-01T00:00:00.000Z",
  },
]

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const originalFetch = global.fetch
    let cloudResponse: () => Promise<Response>
    let fetchSpy: jest.SpyInstance

    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      await dbUtils.snapshot()
    })

    beforeEach(async () => {
      await getContainer()
        .resolve<ICachingModuleService | undefined>(Modules.CACHING, {
          allowUnregistered: true,
        })
        ?.clear({ tags: ["MedusaCloudAnnouncements"] })

      cloudResponse = async () =>
        new Response(JSON.stringify({ announcements: rawAnnouncements }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })

      fetchSpy = jest
        .spyOn(global, "fetch")
        .mockImplementation(async (input, init) => {
          return input.toString().startsWith(CLOUD_API_URL)
            ? cloudResponse()
            : originalFetch(input, init)
        })
    })

    afterEach(() => {
      fetchSpy.mockRestore()
    })

    describe("GET /admin/cloud/announcements", () => {
      it("should require authentication", async () => {
        const error = await api
          .get("/admin/cloud/announcements")
          .catch((e) => e)

        expect(error.response.status).toEqual(401)
      })

      it("should return the published announcements from Medusa Cloud", async () => {
        const response = await api.get(
          "/admin/cloud/announcements",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.announcements).toEqual([
          {
            id: "anno_feature",
            title: "Medusa MCP",
            subtitle: "Manage your store from your AI assistant",
            content: "<p>Connect your AI assistant.</p>",
            image_url: null,
            type: "feature",
            link_url: "https://cloud.medusajs.com/org_test/settings",
            admin_path: null,
            published_at: "2026-10-01T00:00:00.000Z",
          },
          {
            id: "anno_admin",
            title: "Ask AI about your orders",
            subtitle: null,
            content: null,
            image_url: null,
            type: "admin",
            link_url: null,
            admin_path: "/orders",
            published_at: "2026-09-01T00:00:00.000Z",
          },
        ])

        const [url, init] = fetchSpy.mock.calls.find(([input]) =>
          input.toString().startsWith(CLOUD_API_URL)
        )!
        expect(url.toString()).toContain(`${CLOUD_API_URL}/v1/announcements?`)
        expect(init.headers["x-medusa-organization"]).toEqual("org_test")
      })

      it("should return no announcements when the Cloud API responds with an error", async () => {
        cloudResponse = async () => new Response("{}", { status: 500 })

        const response = await api.get(
          "/admin/cloud/announcements",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.announcements).toEqual([])
      })

      it("should return no announcements when the Cloud API can't be reached", async () => {
        cloudResponse = async () => {
          throw new TypeError("fetch failed")
        }

        const response = await api.get(
          "/admin/cloud/announcements",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.announcements).toEqual([])
      })
    })

    describe("/admin/cloud/announcement-preferences", () => {
      it("should require authentication", async () => {
        const error = await api
          .get("/admin/cloud/announcement-preferences")
          .catch((e) => e)

        expect(error.response.status).toEqual(401)
      })

      it("should enable every category by default", async () => {
        const response = await api.get(
          "/admin/cloud/announcement-preferences",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.announcement_preferences).toEqual({
          security: true,
          feature: true,
          cloud: true,
        })
      })

      it("should update a category and keep the others", async () => {
        const response = await api.post(
          "/admin/cloud/announcement-preferences",
          { cloud: false },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.announcement_preferences).toEqual({
          security: true,
          feature: true,
          cloud: false,
        })

        const { data } = await api.get(
          "/admin/cloud/announcement-preferences",
          adminHeaders
        )
        expect(data.announcement_preferences.cloud).toEqual(false)
      })

      it("should share the preferences between users", async () => {
        const otherHeaders = { headers: {} }
        await createAdminUser(dbConnection, otherHeaders, getContainer(), {
          email: "other@medusa.js",
        })

        await api.post(
          "/admin/cloud/announcement-preferences",
          { security: false },
          adminHeaders
        )

        const { data } = await api.get(
          "/admin/cloud/announcement-preferences",
          otherHeaders
        )
        expect(data.announcement_preferences.security).toEqual(false)
      })

      it("should reject unknown categories", async () => {
        const error = await api
          .post(
            "/admin/cloud/announcement-preferences",
            { marketing: false },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("should only request the announcement types of the enabled categories", async () => {
        await api.post(
          "/admin/cloud/announcement-preferences",
          { cloud: false },
          adminHeaders
        )

        await api.get("/admin/cloud/announcements", adminHeaders)

        const [url] = fetchSpy.mock.calls.find(([input]) =>
          input.toString().startsWith(CLOUD_API_URL)
        )!
        expect(new URL(url.toString()).searchParams.getAll("type[]")).toEqual([
          "security",
          "incident",
          "feature",
        ])
      })

      it("should not request announcements when every category is disabled", async () => {
        await api.post(
          "/admin/cloud/announcement-preferences",
          { security: false, feature: false, cloud: false },
          adminHeaders
        )

        const response = await api.get(
          "/admin/cloud/announcements",
          adminHeaders
        )

        expect(response.data.announcements).toEqual([])
        expect(
          fetchSpy.mock.calls.some(([input]) =>
            input.toString().startsWith(CLOUD_API_URL)
          )
        ).toBe(false)
      })
    })
  },
})
