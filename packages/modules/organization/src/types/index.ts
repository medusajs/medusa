export interface CreateOrganizationDTO {
  name: string
  code: string
  parent_id?: string
  org_type: "brand_bu" | "operation" | "department"
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateOrganizationDTO {
  name?: string
  code?: string
  parent_id?: string
  org_type?: "brand_bu" | "operation" | "department"
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}
