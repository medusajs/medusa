import {
  Context,
  FilterableRbacRoleProps,
  FindConfig,
  InternalModuleDeclaration,
  RbacRoleDTO,
} from "@medusajs/framework/types"
import {
  InjectManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils"
import {
  AuthzContextConfig,
  CreateRbacRoleParentDTO,
  InferEntityType,
  IRbacModuleService,
  IRbacModuleServiceOptions,
  MedusaRequest,
  ModulesSdkTypes,
  RbacRoleParentDTO,
  RbacScope,
  UpdateRbacRoleParentDTO,
} from "@medusajs/types"
import {
  RbacPolicy,
  RbacRole,
  RbacRoleAssignment,
  RbacRoleParent,
  RbacRolePolicy,
} from "@models"
import { RbacRepository } from "../repositories"

type InjectedDependencies = {
  rbacRepository: RbacRepository
  rbacRolePolicyService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacRolePolicy>
  >
  rbacRoleService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacRole>
  >
  rbacPolicyService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacPolicy>
  >
}

export default class RbacModuleService
  extends MedusaService({
    RbacRole,
    RbacPolicy,
    RbacRoleParent,
    RbacRolePolicy,
    RbacRoleAssignment,
  })
  implements IRbacModuleService
{
  protected readonly rbacRepository_: RbacRepository
  protected readonly rbacRolePolicyService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacRolePolicy>
  >
  protected readonly rbacRoleService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacRole>
  >
  protected readonly rbacPolicyService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacPolicy>
  >
  protected readonly options_: IRbacModuleServiceOptions

  constructor(
    {
      rbacRepository,
      rbacRoleService,
      rbacPolicyService,
      rbacRolePolicyService,
    }: InjectedDependencies,
    options: IRbacModuleServiceOptions = {
      actors: {},
    },
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    super(...arguments)
    this.rbacRepository_ = rbacRepository
    this.rbacRolePolicyService = rbacRolePolicyService
    this.rbacRoleService = rbacRoleService
    this.rbacPolicyService = rbacPolicyService

    // We always auto inject the user actor authz config
    this.options_ = {
      ...options,
      actors: {
        ...(options.actors ?? {}),
        user: {
          grantees: [
            {
              entity: "user",
              path: "id",
            },
          ],
        },
      },
    }
  }

  @InjectManager()
  async listPoliciesForRole(
    roleId: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any[]> {
    return await this.rbacRepository_.listPoliciesForRole(roleId, sharedContext)
  }

  @InjectManager()
  // @ts-expect-error
  async listRbacRoles(
    filters: FilterableRbacRoleProps = {},
    config: FindConfig<RbacRoleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleDTO[]> {
    const roles = await super.listRbacRoles(
      filters,
      config as any,
      sharedContext
    )

    const shouldIncludePolicies =
      config.relations?.includes("policies") ||
      config.select?.includes("policies")

    if (shouldIncludePolicies && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)
      const policiesByRole = await this.rbacRepository_.listPoliciesForRoles(
        roleIds,
        sharedContext
      )

      for (const role of roles) {
        role.policies = policiesByRole.get(role.id) || []
      }
    }

    return roles as unknown as RbacRoleDTO[]
  }

  @InjectManager()
  // @ts-expect-error
  async listAndCountRbacRoles(
    filters: FilterableRbacRoleProps = {},
    config: FindConfig<RbacRoleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[RbacRoleDTO[], number]> {
    const [roles, count] = await super.listAndCountRbacRoles(
      filters,
      config as any,
      sharedContext
    )

    const shouldIncludePolicies =
      config.relations?.includes("policies") ||
      config.select?.includes("policies")

    if (shouldIncludePolicies && roles.length > 0) {
      const roleIds = roles.map((role) => role.id)
      const policiesByRole = await this.rbacRepository_.listPoliciesForRoles(
        roleIds,
        sharedContext
      )

      for (const role of roles) {
        role.policies = policiesByRole.get(role.id) || []
      }
    }

    return [roles as unknown as RbacRoleDTO[], count]
  }

  @InjectManager()
  // @ts-expect-error
  async createRbacRoleParents(
    data: CreateRbacRoleParentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleParentDTO[]> {
    for (const parent of data) {
      const { role_id, parent_id } = parent

      if (role_id === parent_id) {
        throw new Error(
          `Cannot create role parent relationship: a role cannot be its own parent (role_id: ${role_id})`
        )
      }

      const wouldCreateCycle = await this.rbacRepository_.checkForCycle(
        role_id,
        parent_id,
        sharedContext
      )

      if (wouldCreateCycle) {
        throw new Error(
          `Cannot create role parent relationship: this would create a circular dependency (role_id: ${role_id}, parent_id: ${parent_id})`
        )
      }
    }

    return await super.createRbacRoleParents(data, sharedContext)
  }

  @InjectManager()
  // @ts-expect-error
  async updateRbacRoleParents(
    data: UpdateRbacRoleParentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RbacRoleParentDTO[]> {
    for (const parent of data) {
      const { role_id, parent_id } = parent

      if (parent_id) {
        if (role_id === parent_id) {
          throw new Error(
            `Cannot update role parent relationship: a role cannot be its own parent (role_id: ${role_id})`
          )
        }

        const wouldCreateCycle = await this.rbacRepository_.checkForCycle(
          role_id!,
          parent_id,
          sharedContext
        )

        if (wouldCreateCycle) {
          throw new Error(
            `Cannot update role parent relationship: this would create a circular dependency (role_id: ${role_id}, parent_id: ${parent_id})`
          )
        }
      }
    }

    return await super.updateRbacRoleParents(data, sharedContext)
  }

  async resolveScope<T extends MedusaRequest<any, any>>(
    req: T
  ): Promise<RbacScope | undefined> {
    const scopeResolver = this.options_.scopeResolver
    if (!scopeResolver) {
      return undefined
    }

    return await this.options_.scopeResolver?.(req)
  }

  async retrieveActorAutzContextConfig(
    actorType: string
  ): Promise<AuthzContextConfig | undefined> {
    return this.options_.actors?.[actorType]
  }
}
