export interface CreateBrandDTO {
  name: string
  slug: string
  logo_url?: string
  description?: string
  org_id?: string
  metadata?: Record<string, unknown>
}

export interface UpdateBrandDTO {
  name?: string
  slug?: string
  logo_url?: string
  description?: string
  org_id?: string
  metadata?: Record<string, unknown>
}
