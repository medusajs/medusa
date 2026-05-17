import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableOrganizationProps, OrganizationDTO } from "./common"

/**
 * The main service interface for the Organization Module.
 */
export interface IOrganizationModuleService extends IModuleService {
  /**
   * This method creates organizations.
   */
  createOrganizations(
    data: unknown[],
    sharedContext?: Context
  ): Promise<OrganizationDTO[]>

  /**
   * This method creates an organization.
   */
  createOrganizations(
    data: unknown,
    sharedContext?: Context
  ): Promise<OrganizationDTO>

  /**
   * This method updates an organization.
   */
  updateOrganizations(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<OrganizationDTO>

  /**
   * This method updates organizations matching the specified filters.
   */
  updateOrganizations(
    selector: FilterableOrganizationProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<OrganizationDTO[]>

  /**
   * This method deletes organizations by their IDs.
   */
  deleteOrganizations(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes an organization by its ID.
   */
  deleteOrganizations(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves an organization by its ID.
   */
  retrieveOrganization(
    id: string,
    config?: FindConfig<OrganizationDTO>,
    sharedContext?: Context
  ): Promise<OrganizationDTO>

  /**
   * This method retrieves a list of organizations.
   */
  listOrganizations(
    filters?: FilterableOrganizationProps,
    config?: FindConfig<OrganizationDTO>,
    sharedContext?: Context
  ): Promise<OrganizationDTO[]>

  /**
   * This method retrieves a paginated list of organizations along with the total count.
   */
  listAndCountOrganizations(
    filters?: FilterableOrganizationProps,
    config?: FindConfig<OrganizationDTO>,
    sharedContext?: Context
  ): Promise<[OrganizationDTO[], number]>
}
