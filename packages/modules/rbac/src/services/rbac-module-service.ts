import {
  Context,
  FilterableRbacRoleProps,
  FindConfig,
  InternalModuleDeclaration,
  RbacPolicyDTO,
  RbacRoleAssignmentDTO,
  RbacRoleDTO,
  RbacRolePolicyDTO,
} from "@medusajs/framework/types"
import {
  deduplicate,
  InjectManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils"
import {
  AuthzContextConfig,
  InferEntityType,
  IRbacModuleService,
  IRbacModuleServiceOptions,
  ModulesSdkTypes,
} from "@medusajs/types"
import {
  RbacPolicy,
  RbacRole,
  RbacRoleAssignment,
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
  extends MedusaService<{
    RbacRole: { dto: RbacRoleDTO }
    RbacPolicy: { dto: RbacPolicyDTO }
    RbacRolePolicy: { dto: RbacRolePolicyDTO }
    RbacRoleAssignment: { dto: RbacRoleAssignmentDTO }
  }>({
    RbacRole,
    RbacPolicy,
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

    this.options_ = {
      actors: {
        ...options.actors,
        user: {
          grantees: deduplicate([
            ...(options.actors?.user?.grantees ?? []),
            { entity: "user", path: "id" },
          ]),
        },
        "api-key": options.actors?.["api-key"] ?? {
          actor_entity: "api_key",
          grantees: [{ entity: "user", path: "created_by" }],
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

  async retrieveActorAuthzContextConfig(
    actorType: string
  ): Promise<AuthzContextConfig | undefined> {
    return this.options_.actors?.[actorType]
  }
}
