import {
  Context,
  DAL,
  FindConfig,
  IEventBusModuleService,
  ILinkModule,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  CommonEvents,
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
  eventBusModuleService?: IEventBusModuleService
  primaryKey: string | string[]
  foreignKey: string
  extraFields: string[]
  entityName: string
  serviceName: string
}

export default class LinkModuleService<TLink> implements ILinkModule {
  protected baseRepository_: DAL.RepositoryService
  protected readonly linkService_: LinkService<TLink>
  protected readonly eventBusModuleService_?: IEventBusModuleService
  protected readonly entityName_: string
  protected readonly serviceName_: string
  protected primaryKey_: string[]
  protected foreignKey_: string
  protected extraFields_: string[]

  constructor(
    {
      baseRepository,
      linkService,
      eventBusModuleService,
      primaryKey,
      foreignKey,
      extraFields,
      entityName,
      serviceName,
    }: InjectedDependencies,
    readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.linkService_ = linkService
    this.eventBusModuleService_ = eventBusModuleService
    this.primaryKey_ = !Array.isArray(primaryKey) ? [primaryKey] : primaryKey
    this.foreignKey_ = foreignKey
    this.extraFields_ = extraFields
    this.entityName_ = entityName
    this.serviceName_ = serviceName
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

  private validateFields(data: any | any[]) {
    const dataToValidate = Array.isArray(data) ? data : [data]
    dataToValidate.forEach((d) => {
      const keys = Object.keys(d)
      if (keys.some((k) => !this.isValidKeyName(k))) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid field name provided. Valid field names are ${this.primaryKey_.concat(
            this.foreignKey_
          )}`
        )
      }
    })
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

    await this.eventBusModuleService_?.emit<Record<string, unknown>>(
      (data as { id: unknown }[]).map(({ id }) => ({
        eventName: this.entityName_ + "." + CommonEvents.ATTACHED,
        metadata: {
          source: this.serviceName_,
          action: CommonEvents.ATTACHED,
          object: this.entityName_,
          eventGroupId: sharedContext.eventGroupId,
        },
        data: { id },
      }))
    )

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

    const allData = Array.isArray(data) ? data : [data]
    await this.eventBusModuleService_?.emit<Record<string, unknown>>(
      allData.map(({ id }) => ({
        eventName: this.entityName_ + "." + CommonEvents.DETACHED,
        metadata: {
          source: this.serviceName_,
          action: CommonEvents.DETACHED,
          object: this.entityName_,
          eventGroupId: sharedContext.eventGroupId,
        },
        data: { id },
      }))
    )
  }

  async softDelete(
    data: any,
    { returnLinkableKeys }: SoftDeleteReturn = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, unknown[]> | void> {
    const inputArray = Array.isArray(data) ? data : [data]

    this.validateFields(inputArray)

    let [deletedEntities, cascadedEntitiesMap] = await this.softDelete_(
      inputArray,
      sharedContext
    )

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

    await this.eventBusModuleService_?.emit<Record<string, unknown>>(
      (deletedEntities as { id: string }[]).map(({ id }) => ({
        eventName: this.entityName_ + "." + CommonEvents.DETACHED,
        metadata: {
          source: this.serviceName_,
          action: CommonEvents.DETACHED,
          object: this.entityName_,
          eventGroupId: sharedContext.eventGroupId,
        },
        data: { id },
      }))
    )

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async softDelete_(
    data: any[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[object[], Record<string, string[]>]> {
    return await this.linkService_.softDelete(data, sharedContext)
  }

  async restore(
    data: any,
    { returnLinkableKeys }: RestoreReturn = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, unknown[]> | void> {
    const inputArray = Array.isArray(data) ? data : [data]
    this.validateFields(inputArray)

    let [restoredEntities, cascadedEntitiesMap] = await this.restore_(
      inputArray,
      sharedContext
    )

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

    await this.eventBusModuleService_?.emit<Record<string, unknown>>(
      (restoredEntities as { id: string }[]).map(({ id }) => ({
        eventName: this.entityName_ + "." + CommonEvents.ATTACHED,
        metadata: {
          source: this.serviceName_,
          action: CommonEvents.ATTACHED,
          object: this.entityName_,
          eventGroupId: sharedContext.eventGroupId,
        },
        data: { id },
      }))
    )

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async restore_(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[object[], Record<string, string[]>]> {
    return await this.linkService_.restore(data, sharedContext)
  }
}
