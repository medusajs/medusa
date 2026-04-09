import {
  Context,
  DAL,
  InferEntityType,
  InternalModuleDeclaration,
  IStoreModuleService,
  ModulesSdkTypes,
  StoreTypes,
} from "@medusajs/framework/types"
import {
  EmitEvents,
  getDuplicates,
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaError,
  MedusaService,
  promiseAll,
  removeUndefined,
} from "@medusajs/framework/utils"

import { Store, StoreCurrency, StoreLocale } from "@models"
import { UpdateStoreInput } from "@types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  storeService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class StoreModuleService
  extends MedusaService<{
    Store: { dto: StoreTypes.StoreDTO }
    StoreCurrency: { dto: StoreTypes.StoreCurrencyDTO }
    StoreLocale: { dto: StoreTypes.StoreLocaleDTO }
  }>({ Store, StoreCurrency, StoreLocale })
  implements IStoreModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly storeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Store>
  >

  constructor(
    { baseRepository, storeService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.storeService_ = storeService
  }

  // @ts-expect-error
  async createStores(
    data: StoreTypes.CreateStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  // @ts-expect-error
  async createStores(
    data: StoreTypes.CreateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createStores(
    data: StoreTypes.CreateStoreDTO | StoreTypes.CreateStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.create_(input, sharedContext)

    return await this.baseRepository_.serialize<StoreTypes.StoreDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager()
  async create_(
    data: StoreTypes.CreateStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Store>[]> {
    let normalizedInput = StoreModuleService.normalizeInput(data)
    StoreModuleService.validateCreateRequest(normalizedInput)

    return (
      await this.storeService_.upsertWithReplace(
        normalizedInput,
        { relations: ["supported_currencies", "supported_locales"] },
        sharedContext
      )
    ).entities
  }

  async upsertStores(
    data: StoreTypes.UpsertStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  async upsertStores(
    data: StoreTypes.UpsertStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>

  @InjectManager()
  @EmitEvents()
  async upsertStores(
    data: StoreTypes.UpsertStoreDTO | StoreTypes.UpsertStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    const result = await this.upsertStores_(data, sharedContext)

    return await this.baseRepository_.serialize<
      StoreTypes.StoreDTO[] | StoreTypes.StoreDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  protected async upsertStores_(
    data: StoreTypes.UpsertStoreDTO | StoreTypes.UpsertStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Store>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (store): store is UpdateStoreInput => !!store.id
    )
    const forCreate = input.filter(
      (store): store is StoreTypes.CreateStoreDTO => !store.id
    )

    const operations: Promise<InferEntityType<typeof Store>[]>[] = []

    if (forCreate.length) {
      operations.push(this.create_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.update_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return result
  }

  // @ts-expect-error
  async updateStores(
    id: string,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  // @ts-expect-error
  async updateStores(
    selector: StoreTypes.FilterableStoreProps,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateStores(
    idOrSelector: string | StoreTypes.FilterableStoreProps,
    data: StoreTypes.UpdateStoreDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    let normalizedInput: UpdateStoreInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const stores = await this.storeService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = stores.map((store) => ({
        id: store.id,
        ...data,
      }))
    }

    const updateResult = await this.update_(normalizedInput, sharedContext)

    const stores = await this.baseRepository_.serialize<
      StoreTypes.StoreDTO[] | StoreTypes.StoreDTO
    >(updateResult)

    return isString(idOrSelector) ? stores[0] : stores
  }

  @InjectTransactionManager()
  protected async update_(
    data: UpdateStoreInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Store>[]> {
    const normalizedInput = StoreModuleService.normalizeInput(data)
    StoreModuleService.validateUpdateRequest(normalizedInput)

    return (
      await this.storeService_.upsertWithReplace(
        normalizedInput,
        { relations: ["supported_currencies", "supported_locales"] },
        sharedContext
      )
    ).entities
  }

  private static normalizeInput<T extends StoreTypes.UpdateStoreDTO>(
    stores: T[]
  ): T[] {
    return stores.map((store) =>
      removeUndefined({
        ...store,
        supported_currencies: store.supported_currencies?.map((c) => ({
          ...c,
          currency_code: c.currency_code.toLowerCase(),
        })),
        name: store.name?.trim(),
      })
    )
  }

  private static validateCreateRequest(
    stores: StoreTypes.CreateStoreDTO[] | StoreTypes.UpdateStoreDTO[]
  ) {
    for (const store of stores) {
      if (store.supported_currencies?.length) {
        StoreModuleService.validateUnique(
          store.supported_currencies.map((currency) => currency.currency_code),
          "currency"
        )

        let seenDefault = false
        store.supported_currencies.forEach((currency) => {
          if (currency.is_default) {
            if (seenDefault) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Only one default currency is allowed`
              )
            }
            seenDefault = true
          }
        })

        if (!seenDefault) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `There should be a default currency set for the store`
          )
        }
      }

      if (store.supported_locales?.length) {
        StoreModuleService.validateUnique(
          store.supported_locales.map((locale) => locale.locale_code),
          "locale"
        )
      }
    }
  }

  private static validateUnique = (items: string[], fieldName: string) => {
    const duplicates = getDuplicates(items)

    if (duplicates.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate ${fieldName} codes: ${duplicates.join(", ")}`
      )
    }
  }

  private static validateUpdateRequest(stores: UpdateStoreInput[]) {
    StoreModuleService.validateCreateRequest(stores)
  }
}
