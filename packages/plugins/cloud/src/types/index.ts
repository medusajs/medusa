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
}

export type CloudAnnouncementType =
  | "info"
  | "feature"
  | "warning"
  | "incident"
  | "release"
  | "admin"

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

export type AdminCloudAnnouncementListResponse = {
  announcements: CloudAnnouncement[]
}
