import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableRbacPolicyProps,
  FilterableRbacRoleParentProps,
  FilterableRbacRolePolicyProps,
  FilterableRbacRoleProps,
  RbacPolicyDTO,
  RbacRoleDTO,
  RbacRoleParentDTO,
  RbacRolePolicyDTO,
} from "./common"
import {
  CreateRbacPolicyDTO,
  CreateRbacRoleDTO,
  CreateRbacRoleParentDTO,
  CreateRbacRolePolicyDTO,
  UpdateRbacPolicyDTO,
  UpdateRbacRoleDTO,
  UpdateRbacRoleParentDTO,
  UpdateRbacRolePolicyDTO,
} from "./mutations"

/**
 * The main service interface for the RBAC Module.
 */
export interface IRbacModuleService extends IModuleService {
  /**
   * This method creates a role.
   *
   * @param {CreateRbacRoleDTO} data - The role to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO>} The created role.
   *
   * @example
   * const role = await rbacModuleService.createRbacRoles({
   *   name: "Admin",
   * })
   */
  createRbacRoles(
    data: CreateRbacRoleDTO,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>
  /**
   * This method creates roles.
   *
   * @param {CreateRbacRoleDTO[]} data - The roles to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO[]>} The created roles.
   *
   * @example
   * const roles = await rbacModuleService.createRbacRoles([
   *   {
   *     name: "Admin",
   *   },
   *   {
   *     name: "Editor",
   *   },
   * ])
   */
  createRbacRoles(
    data: CreateRbacRoleDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  /**
   * This method updates an existing role.
   *
   * @param {UpdateRbacRoleDTO} data - The attributes to update in the role.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO>} The updated role.
   *
   * @example
   * const role = await rbacModuleService.updateRbacRoles({
   *   id: "rbrole_123",
   *   name: "Admin",
   * })
   */
  updateRbacRoles(
    data: UpdateRbacRoleDTO,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>
  /**
   * This method updates existing roles.
   *
   * @param {UpdateRbacRoleDTO[]} data - The attributes to update in each role.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO[]>} The updated roles.
   *
   * @example
   * const roles = await rbacModuleService.updateRbacRoles([
   *   {
   *     id: "rbrole_123",
   *     name: "Admin",
   *   },
   *   {
   *     id: "rbrole_321",
   *     name: "Editor",
   *   },
   * ])
   */
  updateRbacRoles(
    data: UpdateRbacRoleDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  /**
   * This method deletes roles by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the role(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the roles are deleted successfully.
   *
   * @example
   * await rbacModuleService.deleteRbacRoles([
   *   "rbrole_123",
   *   "rbrole_321",
   * ])
   */
  deleteRbacRoles(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a role by its ID.
   *
   * @param {string} id - The ID of the role to retrieve.
   * @param {FindConfig<RbacRoleDTO>} config - The configurations determining how the role is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO>} The retrieved role.
   *
   * @example
   * const role = await rbacModuleService.retrieveRbacRole("rbrole_123")
   */
  retrieveRbacRole(
    id: string,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>

  /**
   * This method retrieves a paginated list of roles based on optional filters and configuration.
   *
   * @param {FilterableRbacRoleProps} filters - The filters to apply on the retrieved roles.
   * @param {FindConfig<RbacRoleDTO>} config - The configurations determining how the roles are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleDTO[]>} The list of roles.
   *
   * @example
   * To retrieve a list of roles using their IDs:
   *
   * ```ts
   * const roles = await rbacModuleService.listRbacRoles({
   *   id: ["rbrole_123", "rbrole_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const roles = await rbacModuleService.listRbacRoles(
   *   {
   *     id: ["rbrole_123", "rbrole_321"],
   *   },
   *   {
   *     skip: 0,
   *     take: 15,
   *   }
   * )
   * ```
   */
  listRbacRoles(
    filters?: FilterableRbacRoleProps,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  /**
   * This method retrieves a paginated list of roles along with the total count of available roles satisfying the provided filters.
   *
   * @param {FilterableRbacRoleProps} filters - The filters to apply on the retrieved roles.
   * @param {FindConfig<RbacRoleDTO>} config - The configurations determining how the roles are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RbacRoleDTO[], number]>} The list of roles along with their total count.
   *
   * @example
   * const [roles, count] = await rbacModuleService.listAndCountRbacRoles({
   *   id: ["rbrole_123", "rbrole_321"],
   * })
   */
  listAndCountRbacRoles(
    filters?: FilterableRbacRoleProps,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<[RbacRoleDTO[], number]>

  /**
   * This method creates a policy.
   *
   * @param {CreateRbacPolicyDTO} data - The policy to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO>} The created policy.
   *
   * @example
   * const policy = await rbacModuleService.createRbacPolicies({
   *   name: "manage-products",
   * })
   */
  createRbacPolicies(
    data: CreateRbacPolicyDTO,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>
  /**
   * This method creates policies.
   *
   * @param {CreateRbacPolicyDTO[]} data - The policies to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO[]>} The created policies.
   *
   * @example
   * const policies = await rbacModuleService.createRbacPolicies([
   *   {
   *     name: "manage-products",
   *   },
   *   {
   *     name: "manage-orders",
   *   },
   * ])
   */
  createRbacPolicies(
    data: CreateRbacPolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  /**
   * This method updates an existing policy.
   *
   * @param {UpdateRbacPolicyDTO} data - The attributes to update in the policy.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO>} The updated policy.
   *
   * @example
   * const policy = await rbacModuleService.updateRbacPolicies({
   *   id: "rbpol_123",
   *   name: "manage-products",
   * })
   */
  updateRbacPolicies(
    data: UpdateRbacPolicyDTO,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>
  /**
   * This method updates existing policies.
   *
   * @param {UpdateRbacPolicyDTO[]} data - The attributes to update in each policy.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO[]>} The updated policies.
   *
   * @example
   * const policies = await rbacModuleService.updateRbacPolicies([
   *   {
   *     id: "rbpol_123",
   *     name: "manage-products",
   *   },
   *   {
   *     id: "rbpol_321",
   *     name: "manage-orders",
   *   },
   * ])
   */
  updateRbacPolicies(
    data: UpdateRbacPolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  /**
   * This method deletes policies by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the policy(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the policies are deleted successfully.
   *
   * @example
   * await rbacModuleService.deleteRbacPolicies([
   *   "rbpol_123",
   *   "rbpol_321",
   * ])
   */
  deleteRbacPolicies(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a policy by its ID.
   *
   * @param {string} id - The ID of the policy to retrieve.
   * @param {FindConfig<RbacPolicyDTO>} config - The configurations determining how the policy is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a policy.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO>} The retrieved policy.
   *
   * @example
   * const policy = await rbacModuleService.retrieveRbacPolicy("rbpol_123")
   */
  retrieveRbacPolicy(
    id: string,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>

  /**
   * This method retrieves a paginated list of policies based on optional filters and configuration.
   *
   * @param {FilterableRbacPolicyProps} filters - The filters to apply on the retrieved policies.
   * @param {FindConfig<RbacPolicyDTO>} config - The configurations determining how the policies are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a policy.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO[]>} The list of policies.
   *
   * @example
   * To retrieve a list of policies using their IDs:
   *
   * ```ts
   * const policies = await rbacModuleService.listRbacPolicies({
   *   id: ["rbpol_123", "rbpol_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const policies = await rbacModuleService.listRbacPolicies(
   *   {
   *     id: ["rbpol_123", "rbpol_321"],
   *   },
   *   {
   *     skip: 0,
   *     take: 15,
   *   }
   * )
   * ```
   */
  listRbacPolicies(
    filters?: FilterableRbacPolicyProps,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  /**
   * This method retrieves a paginated list of policies along with the total count of available policies satisfying the provided filters.
   *
   * @param {FilterableRbacPolicyProps} filters - The filters to apply on the retrieved policies.
   * @param {FindConfig<RbacPolicyDTO>} config - The configurations determining how the policies are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a policy.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RbacPolicyDTO[], number]>} The list of policies along with their total count.
   *
   * @example
   * const [policies, count] = await rbacModuleService.listAndCountRbacPolicies({
   *   id: ["rbpol_123", "rbpol_321"],
   * })
   */
  listAndCountRbacPolicies(
    filters?: FilterableRbacPolicyProps,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<[RbacPolicyDTO[], number]>

  /**
   * This method creates a role-policy assignment, associating a policy with a role.
   *
   * @param {CreateRbacRolePolicyDTO} data - The role-policy assignment to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO>} The created role-policy assignment.
   *
   * @example
   * const rolePolicy = await rbacModuleService.createRbacRolePolicies({
   *   role_id: "rbrole_123",
   *   policy_id: "rbpol_123",
   * })
   */
  createRbacRolePolicies(
    data: CreateRbacRolePolicyDTO,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>
  /**
   * This method creates role-policy assignments, associating policies with roles.
   *
   * @param {CreateRbacRolePolicyDTO[]} data - The role-policy assignments to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO[]>} The created role-policy assignments.
   *
   * @example
   * const rolePolicies = await rbacModuleService.createRbacRolePolicies([
   *   {
   *     role_id: "rbrole_123",
   *     policy_id: "rbpol_123",
   *   },
   *   {
   *     role_id: "rbrole_123",
   *     policy_id: "rbpol_321",
   *   },
   * ])
   */
  createRbacRolePolicies(
    data: CreateRbacRolePolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  /**
   * This method updates an existing role-policy assignment.
   *
   * @param {UpdateRbacRolePolicyDTO} data - The attributes to update in the role-policy assignment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO>} The updated role-policy assignment.
   *
   * @example
   * const rolePolicy = await rbacModuleService.updateRbacRolePolicies({
   *   id: "rbrp_123",
   *   policy_id: "rbpol_321",
   * })
   */
  updateRbacRolePolicies(
    data: UpdateRbacRolePolicyDTO,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>
  /**
   * This method updates existing role-policy assignments.
   *
   * @param {UpdateRbacRolePolicyDTO[]} data - The attributes to update in each role-policy assignment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO[]>} The updated role-policy assignments.
   *
   * @example
   * const rolePolicies = await rbacModuleService.updateRbacRolePolicies([
   *   {
   *     id: "rbrp_123",
   *     policy_id: "rbpol_321",
   *   },
   *   {
   *     id: "rbrp_321",
   *     policy_id: "rbpol_123",
   *   },
   * ])
   */
  updateRbacRolePolicies(
    data: UpdateRbacRolePolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  /**
   * This method deletes role-policy assignments by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the role-policy assignment(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the role-policy assignments are deleted successfully.
   *
   * @example
   * await rbacModuleService.deleteRbacRolePolicies([
   *   "rbrp_123",
   *   "rbrp_321",
   * ])
   */
  deleteRbacRolePolicies(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a role-policy assignment by its ID.
   *
   * @param {string} id - The ID of the role-policy assignment to retrieve.
   * @param {FindConfig<RbacRolePolicyDTO>} config - The configurations determining how the role-policy assignment is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-policy assignment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO>} The retrieved role-policy assignment.
   *
   * @example
   * const rolePolicy = await rbacModuleService.retrieveRbacRolePolicy("rbrp_123")
   */
  retrieveRbacRolePolicy(
    id: string,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>

  /**
   * This method retrieves a paginated list of role-policy assignments based on optional filters and configuration.
   *
   * @param {FilterableRbacRolePolicyProps} filters - The filters to apply on the retrieved role-policy assignments.
   * @param {FindConfig<RbacRolePolicyDTO>} config - The configurations determining how the role-policy assignments are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-policy assignment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRolePolicyDTO[]>} The list of role-policy assignments.
   *
   * @example
   * To retrieve a list of role-policy assignments using their IDs:
   *
   * ```ts
   * const rolePolicies = await rbacModuleService.listRbacRolePolicies({
   *   id: ["rbrp_123", "rbrp_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const rolePolicies = await rbacModuleService.listRbacRolePolicies(
   *   {
   *     id: ["rbrp_123", "rbrp_321"],
   *   },
   *   {
   *     skip: 0,
   *     take: 15,
   *   }
   * )
   * ```
   */
  listRbacRolePolicies(
    filters?: FilterableRbacRolePolicyProps,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  /**
   * This method retrieves a paginated list of role-policy assignments along with the total count of available assignments satisfying the provided filters.
   *
   * @param {FilterableRbacRolePolicyProps} filters - The filters to apply on the retrieved role-policy assignments.
   * @param {FindConfig<RbacRolePolicyDTO>} config - The configurations determining how the role-policy assignments are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-policy assignment.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RbacRolePolicyDTO[], number]>} The list of role-policy assignments along with their total count.
   *
   * @example
   * const [rolePolicies, count] = await rbacModuleService.listAndCountRbacRolePolicies({
   *   id: ["rbrp_123", "rbrp_321"],
   * })
   */
  listAndCountRbacRolePolicies(
    filters?: FilterableRbacRolePolicyProps,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<[RbacRolePolicyDTO[], number]>

  /**
   * This method creates a role-parent relation, establishing a hierarchy between a role and its parent role.
   *
   * @param {CreateRbacRoleParentDTO} data - The role-parent relation to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO>} The created role-parent relation.
   *
   * @example
   * const roleParent = await rbacModuleService.createRbacRoleParents({
   *   role_id: "rbrole_123",
   *   parent_id: "rbrole_321",
   * })
   */
  createRbacRoleParents(
    data: CreateRbacRoleParentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>
  /**
   * This method creates role-parent relations, establishing a hierarchy between roles and their parent roles.
   *
   * @param {CreateRbacRoleParentDTO[]} data - The role-parent relations to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO[]>} The created role-parent relations.
   *
   * @example
   * const roleParents = await rbacModuleService.createRbacRoleParents([
   *   {
   *     role_id: "rbrole_123",
   *     parent_id: "rbrole_321",
   *   },
   *   {
   *     role_id: "rbrole_123",
   *     parent_id: "rbrole_456",
   *   },
   * ])
   */
  createRbacRoleParents(
    data: CreateRbacRoleParentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  /**
   * This method updates an existing role-parent relation.
   *
   * @param {UpdateRbacRoleParentDTO} data - The attributes to update in the role-parent relation.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO>} The updated role-parent relation.
   *
   * @example
   * const roleParent = await rbacModuleService.updateRbacRoleParents({
   *   id: "rbrpar_123",
   *   parent_id: "rbrole_321",
   * })
   */
  updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>
  /**
   * This method updates existing role-parent relations.
   *
   * @param {UpdateRbacRoleParentDTO[]} data - The attributes to update in each role-parent relation.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO[]>} The updated role-parent relations.
   *
   * @example
   * const roleParents = await rbacModuleService.updateRbacRoleParents([
   *   {
   *     id: "rbrpar_123",
   *     parent_id: "rbrole_321",
   *   },
   *   {
   *     id: "rbrpar_321",
   *     parent_id: "rbrole_456",
   *   },
   * ])
   */
  updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  /**
   * This method deletes role-parent relations by their IDs.
   *
   * @param {string | string[]} ids - The ID(s) of the role-parent relation(s) to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the role-parent relations are deleted successfully.
   *
   * @example
   * await rbacModuleService.deleteRbacRoleParents([
   *   "rbrpar_123",
   *   "rbrpar_321",
   * ])
   */
  deleteRbacRoleParents(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a role-parent relation by its ID.
   *
   * @param {string} id - The ID of the role-parent relation to retrieve.
   * @param {FindConfig<RbacRoleParentDTO>} config - The configurations determining how the role-parent relation is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-parent relation.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO>} The retrieved role-parent relation.
   *
   * @example
   * const roleParent = await rbacModuleService.retrieveRbacRoleParent("rbrpar_123")
   */
  retrieveRbacRoleParent(
    id: string,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>

  /**
   * This method retrieves a paginated list of role-parent relations based on optional filters and configuration.
   *
   * @param {FilterableRbacRoleParentProps} filters - The filters to apply on the retrieved role-parent relations.
   * @param {FindConfig<RbacRoleParentDTO>} config - The configurations determining how the role-parent relations are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-parent relation.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacRoleParentDTO[]>} The list of role-parent relations.
   *
   * @example
   * To retrieve a list of role-parent relations using their IDs:
   *
   * ```ts
   * const roleParents = await rbacModuleService.listRbacRoleParents({
   *   id: ["rbrpar_123", "rbrpar_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const roleParents = await rbacModuleService.listRbacRoleParents(
   *   {
   *     id: ["rbrpar_123", "rbrpar_321"],
   *   },
   *   {
   *     skip: 0,
   *     take: 15,
   *   }
   * )
   * ```
   */
  listRbacRoleParents(
    filters?: FilterableRbacRoleParentProps,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  /**
   * This method retrieves a paginated list of role-parent relations along with the total count of available relations satisfying the provided filters.
   *
   * @param {FilterableRbacRoleParentProps} filters - The filters to apply on the retrieved role-parent relations.
   * @param {FindConfig<RbacRoleParentDTO>} config - The configurations determining how the role-parent relations are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a role-parent relation.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[RbacRoleParentDTO[], number]>} The list of role-parent relations along with their total count.
   *
   * @example
   * const [roleParents, count] = await rbacModuleService.listAndCountRbacRoleParents({
   *   id: ["rbrpar_123", "rbrpar_321"],
   * })
   */
  listAndCountRbacRoleParents(
    filters?: FilterableRbacRoleParentProps,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<[RbacRoleParentDTO[], number]>

  /**
   * This method retrieves the policies associated with a role, including those inherited from its parent roles.
   *
   * @param {string} roleId - The ID of the role to retrieve the policies for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<RbacPolicyDTO[]>} The list of policies that apply to the role.
   *
   * @example
   * const policies = await rbacModuleService.listPoliciesForRole("rbrole_123")
   */
  listPoliciesForRole(
    roleId: string,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  /**
   * This method soft deletes roles by their IDs.
   *
   * @param {string | string[]} roleIds - The ID(s) of the role(s) to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify a role's related records that should be soft-deleted when the role is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.softDeleteRbacRoles([
   *   "rbrole_123",
   *   "rbrole_321",
   * ])
   */
  softDeleteRbacRoles<TReturnableLinkableKeys extends string = string>(
    roleIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method restores soft deleted roles by their IDs.
   *
   * @param {string | string[]} roleIds - The ID(s) of the role(s) to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which related records to restore along with each of the roles. You can pass to its `returnLinkableKeys` property any of the role's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.restoreRbacRoles([
   *   "rbrole_123",
   *   "rbrole_321",
   * ])
   */
  restoreRbacRoles<TReturnableLinkableKeys extends string = string>(
    roleIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method soft deletes policies by their IDs.
   *
   * @param {string | string[]} policyIds - The ID(s) of the policy(s) to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify a policy's related records that should be soft-deleted when the policy is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.softDeleteRbacPolicies([
   *   "rbpol_123",
   *   "rbpol_321",
   * ])
   */
  softDeleteRbacPolicies<TReturnableLinkableKeys extends string = string>(
    policyIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method restores soft deleted policies by their IDs.
   *
   * @param {string | string[]} policyIds - The ID(s) of the policy(s) to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which related records to restore along with each of the policies. You can pass to its `returnLinkableKeys` property any of the policy's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.restoreRbacPolicies([
   *   "rbpol_123",
   *   "rbpol_321",
   * ])
   */
  restoreRbacPolicies<TReturnableLinkableKeys extends string = string>(
    policyIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method soft deletes role-policy assignments by their IDs.
   *
   * @param {string | string[]} rolePolicyIds - The ID(s) of the role-policy assignment(s) to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify a role-policy assignment's related records that should be soft-deleted when the assignment is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.softDeleteRbacRolePolicies([
   *   "rbrp_123",
   *   "rbrp_321",
   * ])
   */
  softDeleteRbacRolePolicies<TReturnableLinkableKeys extends string = string>(
    rolePolicyIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method restores soft deleted role-policy assignments by their IDs.
   *
   * @param {string | string[]} rolePolicyIds - The ID(s) of the role-policy assignment(s) to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which related records to restore along with each of the role-policy assignments. You can pass to its `returnLinkableKeys` property any of the assignment's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.restoreRbacRolePolicies([
   *   "rbrp_123",
   *   "rbrp_321",
   * ])
   */
  restoreRbacRolePolicies<TReturnableLinkableKeys extends string = string>(
    rolePolicyIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method soft deletes role-parent relations by their IDs.
   *
   * @param {string | string[]} roleParentIds - The ID(s) of the role-parent relation(s) to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify a role-parent relation's related records that should be soft-deleted when the relation is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.softDeleteRbacRoleParents([
   *   "rbrpar_123",
   *   "rbrpar_321",
   * ])
   */
  softDeleteRbacRoleParents<TReturnableLinkableKeys extends string = string>(
    roleParentIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  /**
   * This method restores soft deleted role-parent relations by their IDs.
   *
   * @param {string | string[]} roleParentIds - The ID(s) of the role-parent relation(s) to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which related records to restore along with each of the role-parent relations. You can pass to its `returnLinkableKeys` property any of the relation's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await rbacModuleService.restoreRbacRoleParents([
   *   "rbrpar_123",
   *   "rbrpar_321",
   * ])
   */
  restoreRbacRoleParents<TReturnableLinkableKeys extends string = string>(
    roleParentIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
