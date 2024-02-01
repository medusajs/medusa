import {
  Context,
  DAL,
  FindConfig,
  ILinkModule,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isDefined,
  mapObjectTo,
  MapToConfig,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { LinkService } from "@services"
import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  linkService: LinkService<any>
  primaryKey: string | string[]
  foreignKey: string
  extraFields: string[]
}

export default class LinkModuleService<TLink> implements ILinkModule {
  protected baseRepository_: DAL.RepositoryService
  protected readonly linkService_: LinkService<TLink>
  protected primaryKey_: string[]
  protected foreignKey_: string
  protected extraFields_: string[]

  constructor(
    {
      baseRepository,
      linkService,
      primaryKey,
      foreignKey,
      extraFields,
    }: InjectedDependencies,
    readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.linkService_ = linkService
    this.primaryKey_ = !Array.isArray(primaryKey) ? [primaryKey] : primaryKey
    this.foreignKey_ = foreignKey
    this.extraFields_ = extraFields
  }

  __joinerConfig(): ModuleJoinerConfig {
    return {} as ModuleJoinerConfig
  }

  private buildData(
    primaryKeyData: string | string[],
    foreignKeyData: string,
    extra: Record<string, unknown> = {}
  ) {
    if (this.primaryKey_.length > 1) {
      if (
        !Array.isArray(primaryKeyData) ||
        primaryKeyData.length !== this.primaryKey_.length
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Primary key data must be an array ${this.primaryKey_.length} values`
        )
      }
    }

    const pk = this.primaryKey_.join(",")
    return {
      [pk]: primaryKeyData,
      [this.foreignKey_]: foreignKeyData,
      ...extra,
    }
  }

  private isValidKeyName(name: string) {
    return this.primaryKey_.concat(this.foreignKey_).includes(name)
  }

  private validateFields(data: any) {
    const keys = Object.keys(data)
    if (!keys.every((k) => this.isValidKeyName(k))) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid field name provided. Valid field names are ${this.primaryKey_.concat(
          this.foreignKey_
        )}`
      )
    }
  }

  @InjectManager("baseRepository_")
  async retrieve(
    primaryKeyData: string | string[],
    foreignKeyData: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown> {
    const filter = this.buildData(primaryKeyData, foreignKeyData)
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(filter)
    const entry = await this.linkService_.list(queryOptions, {}, sharedContext)

    if (!entry?.length) {
      const pk = this.primaryKey_.join(",")
      const errMessage = `${pk}[${primaryKeyData}] and ${this.foreignKey_}[${foreignKeyData}]`

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Entry ${errMessage} was not found`
      )
    }

    return entry[0]
  }

  @InjectManager("baseRepository_")
  async list(
    filters: Record<string, unknown> = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown[]> {
    if (!isDefined(config.take)) {
      config.take = null
    }

    const rows = await this.linkService_.list(filters, config, sharedContext)

    return await this.baseRepository_.serialize<object[]>(rows)
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: Record<string, unknown> = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[unknown[], number]> {
    if (!isDefined(config.take)) {
      config.take = null
    }

    const [rows, count] = await this.linkService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [await this.baseRepository_.serialize<object[]>(rows), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
    primaryKeyOrBulkData:
      | string
      | string[]
      | [string | string[], string, Record<string, unknown>][],
    foreignKeyData?: string,
    extraFields?: Record<string, unknown>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const data: unknown[] = []
    if (foreignKeyData === undefined && Array.isArray(primaryKeyOrBulkData)) {
      for (const [primaryKey, foreignKey, extra] of primaryKeyOrBulkData) {
        data.push(
          this.buildData(
            primaryKey as string | string[],
            foreignKey as string,
            extra as Record<string, unknown>
          )
        )
      }
    } else {
      data.push(
        this.buildData(
          primaryKeyOrBulkData as string | string[],
          foreignKeyData!,
          extraFields
        )
      )
    }

    const links = await this.linkService_.create(data, sharedContext)

    return await this.baseRepository_.serialize<object[]>(links)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async dismiss(
    primaryKeyOrBulkData: string | string[] | [string | string[], string][],
    foreignKeyData?: string,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const data: unknown[] = []
    if (foreignKeyData === undefined && Array.isArray(primaryKeyOrBulkData)) {
      for (const [primaryKey, foreignKey] of primaryKeyOrBulkData) {
        data.push(this.buildData(primaryKey, foreignKey as string))
      }
    } else {
      data.push(
        this.buildData(
          primaryKeyOrBulkData as string | string[],
          foreignKeyData!
        )
      )
    }

    const links = await this.linkService_.dismiss(data, sharedContext)

    return await this.baseRepository_.serialize<object[]>(links)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    this.validateFields(data)

    await this.linkService_.delete(data, sharedContext)
  }

  async softDelete(
    data: any,
    { returnLinkableKeys }: SoftDeleteReturn = {},
    sharedContext: Context = {}
  ): Promise<Record<string, unknown[]> | void> {
    this.validateFields(data)

    let [, cascadedEntitiesMap] = await this.softDelete_(data, sharedContext)

    const pk = this.primaryKey_.join(",")
    const entityNameToLinkableKeysMap: MapToConfig = {
      LinkModel: [
        { mapTo: pk, valueFrom: pk },
        { mapTo: this.foreignKey_, valueFrom: this.foreignKey_ },
      ],
    }

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      // Map internal table/column names to their respective external linkable keys
      // eg: product.id = product_id, variant.id = variant_id
      mappedCascadedEntitiesMap = mapObjectTo<Record<string, string[]>>(
        cascadedEntitiesMap,
        entityNameToLinkableKeysMap,
        {
          pick: returnLinkableKeys,
        }
      )
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async softDelete_(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[string[], Record<string, string[]>]> {
    return await this.linkService_.softDelete(data, sharedContext)
  }

  async restore(
    data: any,
    { returnLinkableKeys }: RestoreReturn = {},
    sharedContext: Context = {}
  ): Promise<Record<string, unknown[]> | void> {
    this.validateFields(data)

    let [, cascadedEntitiesMap] = await this.restore_(data, sharedContext)

    const pk = this.primaryKey_.join(",")
    const entityNameToLinkableKeysMap: MapToConfig = {
      LinkModel: [
        { mapTo: pk, valueFrom: pk },
        { mapTo: this.foreignKey_, valueFrom: this.foreignKey_ },
      ],
    }

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      // Map internal table/column names to their respective external linkable keys
      // eg: product.id = product_id, variant.id = variant_id
      mappedCascadedEntitiesMap = mapObjectTo<Record<string, string[]>>(
        cascadedEntitiesMap,
        entityNameToLinkableKeysMap,
        {
          pick: returnLinkableKeys,
        }
      )
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async restore_(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[string[], Record<string, string[]>]> {
    return await this.linkService_.restore(data, sharedContext)
  }
}
