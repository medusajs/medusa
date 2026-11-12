export * from "./rbac"

export type CloudPluginOptions = {
  /**
   * The base URL of the Medusa Cloud API. Defaults to `https://api.prod.medusajs.cloud`.
   */
  apiUrl?: string
  /**
   * The ID of the Medusa Cloud organization that owns the project. When set,
   * announcements targeted at the organization's plan are included.
   */
  organizationId?: string
  /**
   * The Medusa Cloud API key of the project's environment. When set, requests
   * to the Medusa Cloud API are authenticated, so announcements are filtered
   * to the organization's plan.
   */
  apiKey?: string
  /**
   * The handle of the project's Medusa Cloud environment. When set, it's sent
   * with requests to the Medusa Cloud API.
   */
  environmentHandle?: string
  /**
   * Whether to disable the plugin. When `true`, `defineConfig` doesn't load
   * the plugin, so the Medusa Cloud API is never called and its admin widgets
   * and settings page aren't added.
   */
  disabled?: boolean
}

export type CloudAnnouncementType =
  "cloud-feature" | "feature" | "security" | "incident" | "admin"

export type CloudAnnouncement = {
  id: string
  title: string
  subtitle: string | null
  /**
   * HTML authored in the Medusa Cloud admin. Sanitize it before rendering.
   */
  content: string | null
  image_url: string | null
  type: CloudAnnouncementType
  link_url: string | null
  /**
   * The Medusa Admin path the announcement is shown on, such as `/orders`.
   * Only set for `admin` announcements. When `null`, it can be shown on any page.
   */
  admin_path: string | null
  published_at: string | null
}

/**
 * The announcement categories a team can turn on or off. `security` covers
 * `security` and `incident` announcements, `feature` covers `feature`, and
 * `cloud` covers `cloud-feature` and `admin`.
 */
export type CloudAnnouncementCategory = "security" | "feature" | "cloud"

export type CloudAnnouncementPreferences = Record<
  CloudAnnouncementCategory,
  boolean
>

export type AdminCloudAnnouncementPreferencesResponse = {
  announcement_preferences: CloudAnnouncementPreferences
}

export type AdminUpdateCloudAnnouncementPreferences =
  Partial<CloudAnnouncementPreferences>

export type AdminCloudAnnouncementListResponse = {
  announcements: CloudAnnouncement[]
}
