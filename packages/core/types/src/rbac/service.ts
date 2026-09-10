import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  AuthzContextConfig,
  FilterableRbacPolicyProps,
  FilterableRbacRoleAssignmentProps,
  FilterableRbacRoleParentProps,
  FilterableRbacRolePolicyProps,
  FilterableRbacRoleProps,
  RbacPolicyDTO,
  RbacRoleAssignmentDTO,
  RbacRoleDTO,
  RbacRoleParentDTO,
  RbacRolePolicyDTO,
} from "./common"
import {
  CreateRbacPolicyDTO,
  CreateRbacRoleAssignmentDTO,
  CreateRbacRoleDTO,
  CreateRbacRoleParentDTO,
  CreateRbacRolePolicyDTO,
  UpdateRbacPolicyDTO,
  UpdateRbacRoleAssignmentDTO,
  UpdateRbacRoleDTO,
  UpdateRbacRoleParentDTO,
  UpdateRbacRolePolicyDTO,
} from "./mutations"

export interface IRbacModuleService extends IModuleService {
  createRbacRoles(
    data: CreateRbacRoleDTO,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>
  createRbacRoles(
    data: CreateRbacRoleDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  updateRbacRoles(
    data: UpdateRbacRoleDTO,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>
  updateRbacRoles(
    data: UpdateRbacRoleDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  deleteRbacRoles(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  retrieveRbacRole(
    id: string,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleDTO>

  listRbacRoles(
    filters?: FilterableRbacRoleProps,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleDTO[]>

  listAndCountRbacRoles(
    filters?: FilterableRbacRoleProps,
    config?: FindConfig<RbacRoleDTO>,
    sharedContext?: Context
  ): Promise<[RbacRoleDTO[], number]>

  createRbacPolicies(
    data: CreateRbacPolicyDTO,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>
  createRbacPolicies(
    data: CreateRbacPolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  updateRbacPolicies(
    data: UpdateRbacPolicyDTO,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>
  updateRbacPolicies(
    data: UpdateRbacPolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  deleteRbacPolicies(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  retrieveRbacPolicy(
    id: string,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO>

  listRbacPolicies(
    filters?: FilterableRbacPolicyProps,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  listAndCountRbacPolicies(
    filters?: FilterableRbacPolicyProps,
    config?: FindConfig<RbacPolicyDTO>,
    sharedContext?: Context
  ): Promise<[RbacPolicyDTO[], number]>

  createRbacRolePolicies(
    data: CreateRbacRolePolicyDTO,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>
  createRbacRolePolicies(
    data: CreateRbacRolePolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  updateRbacRolePolicies(
    data: UpdateRbacRolePolicyDTO,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>
  updateRbacRolePolicies(
    data: UpdateRbacRolePolicyDTO[],
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  deleteRbacRolePolicies(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  retrieveRbacRolePolicy(
    id: string,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO>

  listRbacRolePolicies(
    filters?: FilterableRbacRolePolicyProps,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<RbacRolePolicyDTO[]>

  listAndCountRbacRolePolicies(
    filters?: FilterableRbacRolePolicyProps,
    config?: FindConfig<RbacRolePolicyDTO>,
    sharedContext?: Context
  ): Promise<[RbacRolePolicyDTO[], number]>

  createRbacRoleParents(
    data: CreateRbacRoleParentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>
  createRbacRoleParents(
    data: CreateRbacRoleParentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>
  updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  deleteRbacRoleParents(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  retrieveRbacRoleParent(
    id: string,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO>

  listRbacRoleParents(
    filters?: FilterableRbacRoleParentProps,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleParentDTO[]>

  listAndCountRbacRoleParents(
    filters?: FilterableRbacRoleParentProps,
    config?: FindConfig<RbacRoleParentDTO>,
    sharedContext?: Context
  ): Promise<[RbacRoleParentDTO[], number]>

  createRbacRoleAssignments(
    data: CreateRbacRoleAssignmentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO>
  createRbacRoleAssignments(
    data: CreateRbacRoleAssignmentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO[]>

  updateRbacRoleAssignments(
    data: UpdateRbacRoleAssignmentDTO,
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO>
  updateRbacRoleAssignments(
    data: UpdateRbacRoleAssignmentDTO[],
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO[]>

  deleteRbacRoleAssignments(
    ids: string | string[],
    sharedContext?: Context
  ): Promise<void>

  retrieveRbacRoleAssignment(
    id: string,
    config?: FindConfig<RbacRoleAssignmentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO>

  listRbacRoleAssignments(
    filters?: FilterableRbacRoleAssignmentProps,
    config?: FindConfig<RbacRoleAssignmentDTO>,
    sharedContext?: Context
  ): Promise<RbacRoleAssignmentDTO[]>

  listAndCountRbacRoleAssignments(
    filters?: FilterableRbacRoleAssignmentProps,
    config?: FindConfig<RbacRoleAssignmentDTO>,
    sharedContext?: Context
  ): Promise<[RbacRoleAssignmentDTO[], number]>

  listPoliciesForRole(
    roleId: string,
    sharedContext?: Context
  ): Promise<RbacPolicyDTO[]>

  softDeleteRbacRoles<TReturnableLinkableKeys extends string = string>(
    roleIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  restoreRbacRoles<TReturnableLinkableKeys extends string = string>(
    roleIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  softDeleteRbacPolicies<TReturnableLinkableKeys extends string = string>(
    policyIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  restoreRbacPolicies<TReturnableLinkableKeys extends string = string>(
    policyIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  softDeleteRbacRolePolicies<TReturnableLinkableKeys extends string = string>(
    rolePolicyIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  restoreRbacRolePolicies<TReturnableLinkableKeys extends string = string>(
    rolePolicyIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  softDeleteRbacRoleParents<TReturnableLinkableKeys extends string = string>(
    roleParentIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  restoreRbacRoleParents<TReturnableLinkableKeys extends string = string>(
    roleParentIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  softDeleteRbacRoleAssignments<
    TReturnableLinkableKeys extends string = string
  >(
    roleAssignmentIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  restoreRbacRoleAssignments<TReturnableLinkableKeys extends string = string>(
    roleAssignmentIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
  retrieveActorAutzContextConfig(
    actorType: string
  ): Promise<AuthzContextConfig | undefined>
}

export interface IRbacModuleServiceOptions {
  /**
   * Keyed by actor type, holds the configuration needed to build the Authz Context
   * necessary to resolve the actor's roles.
   */
  actors: {
    [actor_type: string]: AuthzContextConfig | undefined
  }
}
