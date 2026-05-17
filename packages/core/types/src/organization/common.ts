import { BaseFilterable } from "../dal"

export type OrgType = "brand_bu" | "operation" | "department"

export type OrgStatus = "active" | "inactive"

/**
 * The organization details.
 */
export interface OrganizationDTO {
  /**
   * The ID of the organization.
   */
  id: string

  /**
   * The name of the organization.
   */
  name: string

  /**
   * The unique code of the organization.
   */
  code: string

  /**
   * The parent organization ID.
   */
  parent_id?: string

  /**
   * The type of the organization.
   */
  org_type: OrgType

  /**
   * The status of the organization.
   */
  status?: OrgStatus

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the organization.
   */
  created_at: string

  /**
   * The updated at of the organization.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved organizations.
 */
export interface FilterableOrganizationProps
  extends BaseFilterable<FilterableOrganizationProps> {
  /**
   * Find organizations by name or code through this search term.
   */
  q?: string

  /**
   * The IDs to filter the organizations by.
   */
  id?: string | string[]

  /**
   * Filter organizations by their names.
   */
  name?: string | string[]

  /**
   * Filter organizations by their codes.
   */
  code?: string | string[]

  /**
   * Filter organizations by their parent IDs.
   */
  parent_id?: string | string[]

  /**
   * Filter organizations by their types.
   */
  org_type?: OrgType | OrgType[]

  /**
   * Filter organizations by their statuses.
   */
  status?: OrgStatus | OrgStatus[]
}
