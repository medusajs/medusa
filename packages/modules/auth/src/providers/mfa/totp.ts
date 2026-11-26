import {
  AuthMfaProvider,
  AuthTypes,
  Context,
  DAL,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { AuthMfaFactor } from "@models"
import { TotpMfaProviderOptions } from "@types"
import { decryptSecret, encryptSecret } from "../../utils/mfa"
import {
  findTotpTimeStep,
  generateTotpSecret,
  generateTotpUri,
} from "../../utils/totp"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authMfaFactorService: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthMfaFactor
  >
}

type TotpConfig = {
  issuer: string
  digits: number
  period: number
  window: number
}

export class TotpMfaProvider implements AuthMfaProvider {
  static identifier = "totp"

  readonly method = TotpMfaProvider.identifier

  protected baseRepository_: DAL.RepositoryService
  protected authMfaFactorService_: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthMfaFactor
  >

  constructor(
    { baseRepository, authMfaFactorService }: InjectedDependencies,
    private readonly options_: TotpMfaProviderOptions = {}
  ) {
    this.baseRepository_ = baseRepository
    this.authMfaFactorService_ = authMfaFactorService
  }

  async canVerifyForAuthIdentity(
    data: { auth_identity_id: string },
    sharedContext: Context = {}
  ): Promise<boolean> {
    const [factor] = await this.authMfaFactorService_.list(
      {
        auth_identity_id: data.auth_identity_id,
        provider: this.method,
        status: "enabled",
      },
      { select: ["id"] },
      sharedContext
    )

    return !!factor
  }

  async start(
    data: AuthTypes.AuthMfaStartDTO,
    sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaStartResponse> {
    const totpConfig = this.getTotpConfig_()
    const issuer = data.issuer ?? totpConfig.issuer
    const existingFactors = await this.authMfaFactorService_.list(
      {
        auth_identity_id: data.auth_identity_id,
        provider: this.method,
        status: ["pending", "enabled"],
      },
      { select: ["id"] },
      sharedContext
    )

    if (existingFactors.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "An active TOTP factor already exists for this auth identity"
      )
    }

    const secret = generateTotpSecret()
    const factor = await this.authMfaFactorService_.create(
      {
        auth_identity_id: data.auth_identity_id,
        provider: this.method,
        status: "pending",
        provider_metadata: {
          secret: encryptSecret(secret, this.getEncryptionKey_()),
          issuer,
        },
        metadata: {
          ...(data.metadata ?? {}),
          label: data.label ?? undefined,
        },
      },
      sharedContext
    )

    return {
      mfa: await this.serializeFactor_(factor),
      secret,
      otpauth_url: generateTotpUri({
        issuer,
        accountName: data.label ?? data.auth_identity_id,
        secret,
        digits: totpConfig.digits,
        period: totpConfig.period,
      }),
    }
  }

  async verifySetup(
    data: AuthTypes.AuthMfaVerifyDTO,
    sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaDTO> {
    const factor = await this.authMfaFactorService_.retrieve(
      data.id,
      {},
      sharedContext
    )

    if (factor.provider !== this.method) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Only TOTP MFA factors can be verified with this method"
      )
    }

    if (factor.status === "disabled") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Disabled MFA factors cannot be verified"
      )
    }

    const valid = await this.verifyCode_(factor, data.code, sharedContext)

    if (!valid) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Invalid TOTP code")
    }

    const verifiedFactor =
      factor.status === "pending"
        ? await this.authMfaFactorService_.update(
            { id: factor.id, status: "enabled" },
            sharedContext
          )
        : factor

    return await this.serializeFactor_(verifiedFactor)
  }

  async verify(
    data: { auth_identity_id: string; code: string },
    sharedContext: Context = {}
  ): Promise<boolean> {
    const [factor] = await this.authMfaFactorService_.list(
      {
        auth_identity_id: data.auth_identity_id,
        provider: this.method,
        status: "enabled",
      },
      {},
      sharedContext
    )

    return factor
      ? await this.verifyCode_(factor, data.code, sharedContext)
      : false
  }

  protected async serializeFactor_(
    factor: any
  ): Promise<AuthTypes.AuthMfaDTO> {
    const serialized = await this.baseRepository_.serialize<
      AuthTypes.AuthMfaDTO & {
        provider_metadata?: Record<string, unknown>
      }
    >(factor)

    delete serialized.provider_metadata

    return serialized
  }

  // A code is accepted once: its time step is stored on the factor, and codes
  // from that time step or an earlier one are rejected after that.
  private async verifyCode_(
    factor: any,
    code: string,
    sharedContext: Context
  ): Promise<boolean> {
    const totpConfig = this.getTotpConfig_()
    const secret = decryptSecret(
      factor.provider_metadata?.secret,
      this.getEncryptionKey_()
    )

    const timeStep = findTotpTimeStep({
      secret,
      code,
      digits: totpConfig.digits,
      period: totpConfig.period,
      window: totpConfig.window,
    })

    const lastUsedTimeStep = factor.provider_metadata?.last_used_time_step

    if (
      timeStep === null ||
      (typeof lastUsedTimeStep === "number" && timeStep <= lastUsedTimeStep)
    ) {
      return false
    }

    await this.authMfaFactorService_.update(
      {
        id: factor.id,
        provider_metadata: {
          ...factor.provider_metadata,
          last_used_time_step: timeStep,
        },
      },
      sharedContext
    )

    return true
  }

  protected getEncryptionKey_(): string {
    const encryptionKey = this.options_?.encryption_key

    if (!encryptionKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MFA encryption key is required to use MFA methods"
      )
    }

    return encryptionKey
  }

  protected getTotpConfig_(): TotpConfig {
    const config = {
      issuer: this.options_?.issuer ?? "Medusa",
      digits: this.options_?.digits ?? 6,
      period: this.options_?.period ?? 30,
      window: this.options_?.window ?? 1,
    }

    if (![6, 7, 8].includes(config.digits)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "TOTP digits must be 6, 7, or 8"
      )
    }

    if (!Number.isInteger(config.period) || config.period < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "TOTP period must be a positive integer"
      )
    }

    if (!Number.isInteger(config.window) || config.window < 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "TOTP window must be a non-negative integer"
      )
    }

    return config
  }
}
