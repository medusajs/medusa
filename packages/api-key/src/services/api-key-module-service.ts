import crypto from "crypto"
import util from "util"
import {
  Context,
  DAL,
  ApiKeyTypes,
  IApiKeyModuleService,
  ModulesSdkTypes,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  FindConfig,
  FilterableApiKeyProps,
} from "@medusajs/types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { ApiKey } from "@models"
import { CreateApiKeyDTO, TokenDTO } from "@types"
import {
  ApiKeyType,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  isObject,
  isString,
  promiseAll,
} from "@medusajs/utils"

const scrypt = util.promisify(crypto.scrypt)

const generateMethodForModels = []

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  apiKeyService: ModulesSdkTypes.InternalModuleService<any>
}

export default class ApiKeyModuleService<TEntity extends ApiKey = ApiKey>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    ApiKeyTypes.ApiKeyDTO,
    {
      ApiKey: { dto: ApiKeyTypes.ApiKeyDTO }
    }
  >(ApiKey, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IApiKeyModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly apiKeyService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, apiKeyService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.apiKeyService_ = apiKeyService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  create(
    data: ApiKeyTypes.CreateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>

  @InjectManager("baseRepository_")
  async create(
    data: ApiKeyTypes.CreateApiKeyDTO | ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]> {
    const [createdApiKeys, generatedTokens] = await this.create_(
      Array.isArray(data) ? data : [data],
      sharedContext
    )

    const serializedResponse = await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO[]
    >(createdApiKeys, {
      populate: true,
    })

    // When creating we want to return the raw token, as this will be the only time the user will be able to take note of it for future use.
    const responseWithRawToken = serializedResponse.map((key) => ({
      ...key,
      token:
        generatedTokens.find((t) => t.hashedToken === key.token)?.rawToken ??
        key.token,
      salt: undefined,
    }))

    return Array.isArray(data) ? responseWithRawToken : responseWithRawToken[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], TokenDTO[]]> {
    await this.validateCreateApiKeys_(data, sharedContext)

    const normalizedInput: CreateApiKeyDTO[] = []
    const generatedTokens: TokenDTO[] = []
    for (const key of data) {
      let tokenData: TokenDTO
      if (key.type === ApiKeyType.PUBLISHABLE) {
        tokenData = ApiKeyModuleService.generatePublishableKey()
      } else {
        tokenData = await ApiKeyModuleService.generateSecretKey()
      }

      generatedTokens.push(tokenData)
      normalizedInput.push({
        ...key,
        token: tokenData.hashedToken,
        salt: tokenData.salt,
        redacted: tokenData.redacted,
      })
    }

    const createdApiKeys = await this.apiKeyService_.create(
      normalizedInput,
      sharedContext
    )

    return [createdApiKeys, generatedTokens]
  }

  async update(
    selector: FilterableApiKeyProps,
    data: Omit<ApiKeyTypes.UpdateApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  async update(
    id: string,
    data: Omit<ApiKeyTypes.UpdateApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>
  async update(
    data: ApiKeyTypes.UpdateApiKeyDTO[]
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelectorOrData:
      | string
      | FilterableApiKeyProps
      | ApiKeyTypes.UpdateApiKeyDTO[],
    data?: Omit<ApiKeyTypes.UpdateApiKeyDTO, "id">,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO[] | ApiKeyTypes.ApiKeyDTO> {
    const updatedApiKeys = await this.update_(
      idOrSelectorOrData,
      data,
      sharedContext
    )

    const serializedResponse = await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO[]
    >(updatedApiKeys.map(omitToken), {
      populate: true,
    })

    return isString(idOrSelectorOrData)
      ? serializedResponse[0]
      : serializedResponse
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    idOrSelectorOrData:
      | string
      | FilterableApiKeyProps
      | ApiKeyTypes.UpdateApiKeyDTO[],
    data?: Omit<ApiKeyTypes.UpdateApiKeyDTO, "id">,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const normalizedInput =
      await this.normalizeUpdateInput_<ApiKeyTypes.UpdateApiKeyDTO>(
        idOrSelectorOrData,
        data,
        sharedContext
      )

    const updateRequest = normalizedInput.map((k) => ({
      id: k.id,
      title: k.title,
    }))

    const updatedApiKeys = await this.apiKeyService_.update(
      updateRequest,
      sharedContext
    )
    return updatedApiKeys
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config?: FindConfig<ApiKeyTypes.ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO> {
    const apiKey = await this.apiKeyService_.retrieve(id, config, sharedContext)

    return await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO>(
      omitToken(apiKey),
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async list(
    filters?: ApiKeyTypes.FilterableApiKeyProps,
    config?: FindConfig<ApiKeyTypes.ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]> {
    const apiKeys = await this.apiKeyService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO[]>(
      apiKeys.map(omitToken),
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters?: ApiKeyTypes.FilterableApiKeyProps,
    config?: FindConfig<ApiKeyTypes.ApiKeyDTO>,
    sharedContext?: Context
  ): Promise<[ApiKeyTypes.ApiKeyDTO[], number]> {
    const [apiKeys, count] = await this.apiKeyService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO[]>(
        apiKeys.map(omitToken),
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  async revoke(
    selector: FilterableApiKeyProps,
    data: Omit<ApiKeyTypes.RevokeApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  async revoke(
    id: string,
    data: Omit<ApiKeyTypes.RevokeApiKeyDTO, "id">,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>
  async revoke(
    data: ApiKeyTypes.RevokeApiKeyDTO[]
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  @InjectManager("baseRepository_")
  async revoke(
    idOrSelectorOrData:
      | string
      | FilterableApiKeyProps
      | ApiKeyTypes.RevokeApiKeyDTO[],
    data?: Omit<ApiKeyTypes.RevokeApiKeyDTO, "id">,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO[] | ApiKeyTypes.ApiKeyDTO> {
    const revokedApiKeys = await this.revoke_(
      idOrSelectorOrData,
      data,
      sharedContext
    )

    const serializedResponse = await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO[]
    >(revokedApiKeys.map(omitToken), {
      populate: true,
    })

    return isString(idOrSelectorOrData)
      ? serializedResponse[0]
      : serializedResponse
  }

  @InjectTransactionManager("baseRepository_")
  async revoke_(
    idOrSelectorOrData:
      | string
      | FilterableApiKeyProps
      | ApiKeyTypes.RevokeApiKeyDTO[],
    data?: Omit<ApiKeyTypes.RevokeApiKeyDTO, "id">,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const normalizedInput =
      await this.normalizeUpdateInput_<ApiKeyTypes.RevokeApiKeyDTO>(
        idOrSelectorOrData,
        data,
        sharedContext
      )

    await this.validateRevokeApiKeys_(normalizedInput)

    const updateRequest = normalizedInput.map((k) => {
      const revokedAt = new Date()
      if (k.revoke_in && k.revoke_in > 0) {
        revokedAt.setSeconds(revokedAt.getSeconds() + k.revoke_in)
      }

      return {
        id: k.id,
        revoked_at: revokedAt,
        revoked_by: k.revoked_by,
      }
    })

    const revokedApiKeys = await this.apiKeyService_.update(
      updateRequest,
      sharedContext
    )

    return revokedApiKeys
  }

  @InjectTransactionManager("baseRepository_")
  async authenticate(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | false> {
    // Since we only allow up to 2 active tokens, getitng the list and checking each token isn't an issue.
    // We can always filter on the redacted key if we add support for an arbitrary number of tokens.
    const secretKeys = await this.apiKeyService_.list(
      {
        type: ApiKeyType.SECRET,
        // If the revoke date is set in the future, it means the key is still valid.
        $or: [
          { revoked_at: { $eq: null } },
          { revoked_at: { $gt: new Date() } },
        ],
      },
      {},
      sharedContext
    )

    const matches = await promiseAll(
      secretKeys.map(async (dbKey) => {
        const hashedInput = await ApiKeyModuleService.calculateHash(
          token,
          dbKey.salt
        )
        if (hashedInput === dbKey.token) {
          return dbKey
        }

        return undefined
      })
    )

    const matchedKeys = matches.filter((match) => match)
    if (!matchedKeys.length) {
      return false
    }

    const serialized =
      await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO>(
        matchedKeys[0],
        { populate: true }
      )

    return serialized
  }

  protected async validateCreateApiKeys_(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    sharedContext: Context = {}
  ): Promise<void> {
    if (!data.length) {
      return
    }

    // There can only be 2 secret keys at most, and one has to be with a revoked_at date set, so only 1 can be newly created.
    const secretKeysToCreate = data.filter((k) => k.type === ApiKeyType.SECRET)
    if (secretKeysToCreate.length > 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You can only create one secret key at a time. You tried to create ${secretKeysToCreate.length} secret keys.`
      )
    }

    // There already is a key that is not set to expire/or it hasn't expired
    const dbSecretKeys = await this.apiKeyService_.list(
      {
        type: ApiKeyType.SECRET,
        $or: [
          { revoked_at: { $eq: null } },
          { revoked_at: { $gt: new Date() } },
        ],
      },
      {},
      sharedContext
    )

    if (dbSecretKeys.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You can only have one active secret key a time. Revoke or delete your existing key before creating a new one.`
      )
    }
  }

  protected async normalizeUpdateInput_<T>(
    idOrSelectorOrData: string | FilterableApiKeyProps | T[],
    data?: Omit<T, "id">,
    sharedContext: Context = {}
  ): Promise<T[]> {
    let normalizedInput: T[] = []
    if (isString(idOrSelectorOrData)) {
      normalizedInput = [{ id: idOrSelectorOrData, ...data } as T]
    }

    if (Array.isArray(idOrSelectorOrData)) {
      normalizedInput = idOrSelectorOrData
    }

    if (isObject(idOrSelectorOrData)) {
      const apiKeys = await this.apiKeyService_.list(
        idOrSelectorOrData,
        {},
        sharedContext
      )

      normalizedInput = apiKeys.map(
        (apiKey) =>
          ({
            id: apiKey.id,
            ...data,
          } as T)
      )
    }

    return normalizedInput
  }

  protected async validateRevokeApiKeys_(
    data: ApiKeyTypes.RevokeApiKeyDTO[],
    sharedContext: Context = {}
  ): Promise<void> {
    if (!data.length) {
      return
    }

    if (data.some((k) => !k.id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You must provide an api key id field when revoking a key.`
      )
    }

    if (data.some((k) => !k.revoked_by)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You must provide a revoked_by field when revoking a key.`
      )
    }

    const revokedApiKeys = await this.apiKeyService_.list(
      {
        id: data.map((k) => k.id),
        type: ApiKeyType.SECRET,
        revoked_at: { $ne: null },
      },
      {},
      sharedContext
    )

    if (revokedApiKeys.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `There are ${revokedApiKeys.length} secret keys that are already revoked.`
      )
    }
  }

  // These are public keys, so there is no point hashing them.
  protected static generatePublishableKey(): TokenDTO {
    const token = "pk_" + crypto.randomBytes(32).toString("hex")

    return {
      rawToken: token,
      hashedToken: token,
      salt: "",
      redacted: redactKey(token),
    }
  }

  protected static async generateSecretKey(): Promise<TokenDTO> {
    const token = "sk_" + crypto.randomBytes(32).toString("hex")
    const salt = crypto.randomBytes(16).toString("hex")
    const hashed = await this.calculateHash(token, salt)

    return {
      rawToken: token,
      hashedToken: hashed,
      salt,
      redacted: redactKey(token),
    }
  }

  protected static async calculateHash(
    token: string,
    salt: string
  ): Promise<string> {
    return ((await scrypt(token, salt, 64)) as Buffer).toString("hex")
  }
}

// We are mutating the object here as what microORM relies on non-enumerable fields for serialization, among other things.
const omitToken = (
  // We have to make salt optional before deleting it (and we do want it required in the DB)
  key: Omit<ApiKey, "salt"> & { salt?: string }
): Omit<ApiKey, "salt"> => {
  key.token = key.type === ApiKeyType.SECRET ? "" : key.token
  delete key.salt
  return key
}

const redactKey = (key: string): string => {
  return [key.slice(0, 6), key.slice(-3)].join("***")
}
