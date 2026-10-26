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

export type CloudAnnouncement = {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  type: CloudAnnouncementType
  link_url: string | null
  published_at: string | null
}

export type AdminCloudAnnouncementListResponse = {
  announcements: CloudAnnouncement[]
}
