import {
  ApiKeyTypes,
  Context,
  DAL,
  FilterableApiKeyProps,
  FindConfig,
  IApiKeyModuleService,
  InferEntityType,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@zjedene-medusa/framework/types"
import {
  ApiKeyType,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isObject,
  isPresent,
  isString,
  MedusaContext,
  MedusaError,
  MedusaService,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { ApiKey } from "@models"
import {
  CreateApiKeyDTO,
  RevokeApiKeyInput,
  TokenDTO,
  UpdateApiKeyInput,
} from "@types"
import crypto from "crypto"
import util from "util"
import { joinerConfig } from "../joiner-config"

const scrypt = util.promisify(crypto.scrypt)

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  apiKeyService: ModulesSdkTypes.IMedusaInternalService<any>
}

export class ApiKeyModuleService
  extends MedusaService<{
    ApiKey: { dto: ApiKeyTypes.ApiKeyDTO }
  }>({ ApiKey })
  implements IApiKeyModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly apiKeyService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ApiKey>
  >

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

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async deleteApiKeys(
    ids: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.deleteApiKeys_(ids, sharedContext)
  }

  @InjectTransactionManager()
  protected async deleteApiKeys_(
    ids: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const apiKeyIds = Array.isArray(ids) ? ids : [ids]

    const unrevokedApiKeys = (
      await this.apiKeyService_.list(
        {
          id: ids,
          $or: [
            { revoked_at: { $eq: null } },
            { revoked_at: { $gt: new Date() } },
          ],
        },
        { select: ["id"] },
        sharedContext
      )
    ).map((apiKey) => apiKey.id)

    if (isPresent(unrevokedApiKeys)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot delete api keys that are not revoked - ${unrevokedApiKeys.join(
          ", "
        )}`
      )
    }

    return await super.deleteApiKeys(apiKeyIds, sharedContext)
  }

  //@ts-expect-error
  createApiKeys(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  //@ts-expect-error
  createApiKeys(
    data: ApiKeyTypes.CreateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>

  @InjectManager()
  @EmitEvents()
  //@ts-expect-error
  async createApiKeys(
    data: ApiKeyTypes.CreateApiKeyDTO | ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]> {
    const [createdApiKeys, generatedTokens] = await this.createApiKeys_(
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

  @InjectTransactionManager()
  protected async createApiKeys_(
    data: ApiKeyTypes.CreateApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[InferEntityType<typeof ApiKey>[], TokenDTO[]]> {
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

  async upsertApiKeys(
    data: ApiKeyTypes.UpsertApiKeyDTO[],
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>
  async upsertApiKeys(
    data: ApiKeyTypes.UpsertApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>

  @InjectManager()
  @EmitEvents()
  async upsertApiKeys(
    data: ApiKeyTypes.UpsertApiKeyDTO | ApiKeyTypes.UpsertApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]> {
    const result = await this.upsertApiKeys_(data, sharedContext)

    return await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO[]>(result)
  }

  @InjectTransactionManager()
  protected async upsertApiKeys_(
    data: ApiKeyTypes.UpsertApiKeyDTO | ApiKeyTypes.UpsertApiKeyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | ApiKeyTypes.ApiKeyDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (apiKey): apiKey is UpdateApiKeyInput => !!apiKey.id
    )
    const forCreate = input.filter(
      (apiKey): apiKey is ApiKeyTypes.CreateApiKeyDTO => !apiKey.id
    )

    const operations: Promise<ApiKeyTypes.ApiKeyDTO[]>[] = []

    if (forCreate.length) {
      const op = async () => {
        const [createdApiKeys, generatedTokens] = await this.createApiKeys_(
          forCreate,
          sharedContext
        )
        const serializedResponse = await this.baseRepository_.serialize<
          ApiKeyTypes.ApiKeyDTO[]
        >(createdApiKeys)

        return serializedResponse.map(
          (key) =>
            ({
              ...key,
              token:
                generatedTokens.find((t) => t.hashedToken === key.token)
                  ?.rawToken ?? key.token,
              salt: undefined,
            } as ApiKeyTypes.ApiKeyDTO)
        )
      }

      operations.push(op())
    }

    if (forUpdate.length) {
      const op = async () => {
        return await this.updateApiKeys_(forUpdate, sharedContext)
      }

      operations.push(op())
    }

    const result = (await promiseAll(operations)).flat()
    return Array.isArray(data) ? result : result[0]
  }

  //@ts-expect-error
  async updateApiKeys(
    id: string,
    data: ApiKeyTypes.UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>
  //@ts-expect-error
  async updateApiKeys(
    selector: FilterableApiKeyProps,
    data: ApiKeyTypes.UpdateApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>

  @InjectManager()
  @EmitEvents()
  //@ts-expect-error
  async updateApiKeys(
    idOrSelector: string | FilterableApiKeyProps,
    data: ApiKeyTypes.UpdateApiKeyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO[] | ApiKeyTypes.ApiKeyDTO> {
    let normalizedInput = await this.normalizeUpdateInput_<UpdateApiKeyInput>(
      idOrSelector,
      data,
      sharedContext
    )

    const updatedApiKeys = await this.updateApiKeys_(
      normalizedInput,
      sharedContext
    )

    const serializedResponse = await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO[]
    >(updatedApiKeys.map(omitToken), {
      populate: true,
    })

    return isString(idOrSelector) ? serializedResponse[0] : serializedResponse
  }

  @InjectTransactionManager()
  protected async updateApiKeys_(
    normalizedInput: UpdateApiKeyInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ApiKey>[]> {
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

  @InjectManager()
  // @ts-expect-error
  async retrieveApiKey(
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

  @InjectManager()
  //@ts-expect-error
  async listApiKeys(
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

  @InjectManager()
  //@ts-expect-error
  async listAndCountApiKeys(
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
    id: string,
    data: ApiKeyTypes.RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO>
  async revoke(
    selector: FilterableApiKeyProps,
    data: ApiKeyTypes.RevokeApiKeyDTO,
    sharedContext?: Context
  ): Promise<ApiKeyTypes.ApiKeyDTO[]>

  @InjectManager()
  @EmitEvents()
  async revoke(
    idOrSelector: string | FilterableApiKeyProps,
    data: ApiKeyTypes.RevokeApiKeyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO[] | ApiKeyTypes.ApiKeyDTO> {
    const normalizedInput = await this.normalizeUpdateInput_<RevokeApiKeyInput>(
      idOrSelector,
      data,
      sharedContext
    )
    const revokedApiKeys = await this.revoke_(normalizedInput, sharedContext)

    const serializedResponse = await this.baseRepository_.serialize<
      ApiKeyTypes.ApiKeyDTO[]
    >(revokedApiKeys.map(omitToken), {
      populate: true,
    })

    return isString(idOrSelector) ? serializedResponse[0] : serializedResponse
  }

  @InjectTransactionManager()
  async revoke_(
    normalizedInput: RevokeApiKeyInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ApiKey>[]> {
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

  @InjectManager()
  async authenticate(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ApiKeyTypes.ApiKeyDTO | false> {
    const result = await this.authenticate_(token, sharedContext)
    if (!result) {
      return false
    }

    const serialized =
      await this.baseRepository_.serialize<ApiKeyTypes.ApiKeyDTO>(result, {
        populate: true,
      })

    return serialized
  }

  @InjectTransactionManager()
  protected async authenticate_(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ApiKey> | false> {
    const secretKeys = await this.apiKeyService_.list(
      {
        type: ApiKeyType.SECRET,
        // There could be many unrevoked keys at the same time, so we narrow the list down by the redacted key.
        // Note that the redacted key doesn't guarantee uniqueness and is not an authentication check, but just an optimization.
        redacted: redactKey(token),
        // If the revoke date is set in the future, it means the key is still valid.
        $or: [
          { revoked_at: { $eq: null } },
          { revoked_at: { $gt: new Date() } },
        ],
      },
      {
        take: undefined,
      },
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

    const matchedKeys = matches.filter((match) => !!match)
    if (!matchedKeys.length) {
      return false
    }
    return matchedKeys[0]
  }

  protected async normalizeUpdateInput_<T>(
    idOrSelector: string | FilterableApiKeyProps,
    data: Omit<T, "id">,
    sharedContext: Context = {}
  ): Promise<T[]> {
    let normalizedInput: T[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data } as T]
    }

    if (isObject(idOrSelector)) {
      const apiKeys = await this.apiKeyService_.list(
        idOrSelector,
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
    data: RevokeApiKeyInput[],
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
        revoked_at: { $lt: new Date() },
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
  key: Omit<InferEntityType<typeof ApiKey>, "salt"> & { salt?: string }
): Omit<InferEntityType<typeof ApiKey>, "salt"> => {
  key.token = key.type === ApiKeyType.SECRET ? "" : key.token
  delete key.salt
  return key
}

const redactKey = (key: string): string => {
  return [key.slice(0, 6), key.slice(-3)].join("***")
}
