import { ICachingModuleService, Logger } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  CloudAnnouncement,
  CloudAnnouncementType,
  CloudPluginOptions,
} from "../../types"

export const DEFAULT_CLOUD_API_URL = "https://api.prod.medusajs.cloud"
export const ANNOUNCEMENTS_LIMIT = 50
export const ANNOUNCEMENTS_CACHE_TTL = 10 * 60 // 10 minutes
const REQUEST_TIMEOUT_MS = 5000

type RawAnnouncement = {
  id: string
  title: string
  subtitle?: string
  content?: string | null
  image_url?: string
  type?: CloudAnnouncementType
  link_url?: string
  admin_path?: string | null
  published_at?: string
}

type InjectedDependencies = {
  [ContainerRegistrationKeys.LOGGER]: Logger
  [Modules.CACHING]?: ICachingModuleService
}

export default class CloudModuleService {
  protected readonly container_: InjectedDependencies
  protected readonly options_: CloudPluginOptions

  constructor(
    container: InjectedDependencies,
    options: CloudPluginOptions = {}
  ) {
    this.container_ = container
    this.options_ = options
  }

  /**
   * Lists the announcements of every type that are published, leaving out
   * those scheduled for a later date.
   */
  async listAnnouncements(): Promise<CloudAnnouncement[]> {
    const announcements = await this.fetchAnnouncements_()
    const now = Date.now()

    return announcements
      .filter((raw) => !(raw.published_at && Date.parse(raw.published_at) > now))
      .map((raw) => this.toAnnouncement_(raw))
  }

  protected toAnnouncement_(raw: RawAnnouncement): CloudAnnouncement {
    return {
      id: raw.id,
      title: raw.title,
      subtitle: raw.subtitle ?? null,
      content: raw.content || null,
      image_url: this.isHttpUrl_(raw.image_url) ? raw.image_url : null,
      type: raw.type ?? "feature",
      link_url: this.isHttpUrl_(raw.link_url) ? raw.link_url : null,
      admin_path: raw.type === "admin" ? raw.admin_path || null : null,
      published_at: raw.published_at ?? null,
    }
  }

  protected isHttpUrl_(value?: string | null): value is string {
    if (!value) {
      return false
    }

    try {
      const { protocol } = new URL(value)
      return protocol === "https:" || protocol === "http:"
    } catch {
      return false
    }
  }

  /**
   * Fetches the latest published announcements from the Medusa Cloud API.
   * Results are cached with the Caching Module when it's registered, so admin
   * page loads don't each hit the Cloud API.
   */
  protected async fetchAnnouncements_(): Promise<RawAnnouncement[]> {
    const query = new URLSearchParams({
      limit: String(ANNOUNCEMENTS_LIMIT),
      offset: "0",
      order: "-published_at",
    })

    const path = "/v1/announcements"
    const caching = this.container_[Modules.CACHING]
    const logger = this.container_[ContainerRegistrationKeys.LOGGER]
    let cacheKey: string | undefined

    if (caching) {
      try {
        cacheKey = await caching.computeKey({
          path,
          query: query.toString(),
          apiUrl: this.options_.apiUrl,
          organizationId: this.options_.organizationId,
        })
        const cached = (await caching.get({ key: cacheKey })) as {
          announcements: RawAnnouncement[]
        } | null

        if (cached) {
          return cached.announcements
        }
      } catch (error) {
        logger.warn(
          `Failed to read Medusa Cloud announcements from the cache: ${error.message}`
        )
      }
    }

    const data = await this.request_<{ announcements?: RawAnnouncement[] }>(
      path,
      query
    )
    const announcements = data.announcements ?? []

    if (caching && cacheKey) {
      try {
        await caching.set({
          key: cacheKey,
          data: { announcements },
          ttl: ANNOUNCEMENTS_CACHE_TTL,
          tags: [],
        })
      } catch (error) {
        logger.warn(
          `Failed to cache Medusa Cloud announcements: ${error.message}`
        )
      }
    }

    return announcements
  }

  /**
   * Sends a `GET` request to the Medusa Cloud API and returns the parsed JSON body.
   * Throws when the request times out or the API responds with an error status.
   */
  private async request_<T>(path: string, query?: URLSearchParams): Promise<T> {
    const { apiUrl, organizationId } = this.options_
    const baseUrl = (apiUrl || DEFAULT_CLOUD_API_URL).replace(/\/+$/, "")
    const url = new URL(`${baseUrl}${path}`)
    query?.forEach((value, key) => url.searchParams.set(key, value))

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        ...(organizationId ? { "x-medusa-organization": organizationId } : {}),
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Medusa Cloud request to ${path} failed with status ${response.status}`
      )
    }

    return (await response.json()) as T
  }
}
