import {
  Context,
  DAL,
  FindConfig,
  ILinkModule,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MapToConfig,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  mapObjectTo,
} from "@medusajs/utils"
import { PivotService } from "@services"
import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pivotService: PivotService<any>
  primaryKey: string | string[]
  foreignKey: string
}

export default class LinkModuleService<TPivot> implements ILinkModule {
  protected baseRepository_: DAL.RepositoryService
  protected readonly pivotService_: PivotService<TPivot>
  protected primaryKey_: string[]
  protected foreignKey_: string

  constructor(
    {
      baseRepository,
      pivotService,
      primaryKey,
      foreignKey,
    }: InjectedDependencies,
    readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.pivotService_ = pivotService
    this.primaryKey_ = !Array.isArray(primaryKey) ? [primaryKey] : primaryKey
    this.foreignKey_ = foreignKey
  }

  __joinerConfig(): ModuleJoinerConfig {
    return {} as ModuleJoinerConfig
  }

  private buildData(primaryKeyData: string | string[], foreignKeyData: string) {
    if (primaryKeyData && Array.isArray(this.primaryKey_)) {
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

    const filter = this.primaryKey_.map((key, index) => ({
      [key]: primaryKeyData[index],
    }))

    filter[this.foreignKey_] = foreignKeyData
    return filter
  }

  private isValidFieldName(name: string) {
    return this.primaryKey_.concat(this.foreignKey_).includes(name)
  }

  private validateFields(data: any) {
    const keys = Object.keys(data)
    if (!keys.every((k) => this.isValidFieldName(k))) {
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
    const entry = await this.pivotService_.list(queryOptions, {}, sharedContext)

    if (!entry?.length) {
      const errMessage = filter.reduce((acc, curr) => {
        return `${acc} ${Object.keys(curr)[0]}[${Object.values(curr)[0]}]`
      }, "")

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
    const rows = await this.pivotService_.list(filters, config, sharedContext)

    return JSON.parse(JSON.stringify(rows))
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: Record<string, unknown> = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[unknown[], number]> {
    const [rows, count] = await this.pivotService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [JSON.parse(JSON.stringify(rows)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
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

    const links = await this.pivotService_.create(data, sharedContext)
    return links
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown[]> {
    this.validateFields(data)

    return await this.pivotService_.delete(data, sharedContext)
  }

  async softDelete(
    data: any,
    { returnLinkableKeys }: { returnLinkableKeys?: string[] } = {
      returnLinkableKeys: [],
    },
    sharedContext: Context = {}
  ): Promise<[unknown[], Record<string, unknown[]>]> {
    let [, cascadedEntitiesMap] = await this.softDelete_(data, sharedContext)

    const pk = this.primaryKey_.join(",")
    const entityNameToLinkableKeysMap: MapToConfig = {
      PivotModel: [
        { mapTo: pk, valueFrom: pk },
        { mapTo: this.foreignKey_, valueFrom: this.foreignKey_ },
      ],
    }

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<Record<string, string[]>>(
        cascadedEntitiesMap,
        entityNameToLinkableKeysMap,
        {
          pick: returnLinkableKeys as string[],
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
    return await this.pivotService_.softDelete(data, sharedContext)
  }

  async restore(
    data: any,
    { returnLinkableKeys }: { returnLinkableKeys?: string[] } = {
      returnLinkableKeys: [],
    },
    sharedContext: Context = {}
  ): Promise<[unknown[], Record<string, unknown[]>]> {
    let [, cascadedEntitiesMap] = await this.restore_(data, sharedContext)

    const pk = this.primaryKey_.join(",")
    const entityNameToLinkableKeysMap: MapToConfig = {
      PivotModel: [
        { mapTo: pk, valueFrom: pk },
        { mapTo: this.foreignKey_, valueFrom: this.foreignKey_ },
      ],
    }

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<Record<string, string[]>>(
        cascadedEntitiesMap,
        entityNameToLinkableKeysMap,
        {
          pick: returnLinkableKeys as string[],
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
    return await this.pivotService_.restore(data, sharedContext)
  }
}
