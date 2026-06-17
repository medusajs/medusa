import {
  AuthTypes,
  Context,
  IAuthVerificationProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { AuthVerification } from "@models"
import { TokenVerificationProviderOptions } from "@types"
import {
  generateVerificationToken,
  getVerificationTokenTtlMs,
  hashVerificationToken,
} from "../../utils/verification-token"

type InjectedDependencies = {
  authVerificationService: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthVerification
  >
}

export class TokenVerificationProvider implements IAuthVerificationProvider {
  static identifier = "token"

  readonly identifier = TokenVerificationProvider.identifier

  protected authVerificationService_: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthVerification
  >
  protected options_: TokenVerificationProviderOptions

  constructor(
    { authVerificationService }: InjectedDependencies,
    options: TokenVerificationProviderOptions = {}
  ) {
    this.authVerificationService_ = authVerificationService
    this.options_ = options
  }

  async request(
    data: AuthTypes.RequestAuthVerificationDTO,
    sharedContext: Context = {}
  ): Promise<AuthTypes.RequestAuthVerificationResponse> {
    const existingVerifications = await this.authVerificationService_.list(
      {
        auth_identity_id: data.auth_identity_id,
        entity_id: data.entity_id,
        entity_type: data.entity_type,
      },
      { take: 1, skip: 0 },
      sharedContext
    )

    if (existingVerifications.length && existingVerifications[0].verified_at) {
      return existingVerifications[0]
    }

    const token = generateVerificationToken()
    const tokenHash = hashVerificationToken(token)
    const requestedAt = new Date(Date.now())
    const expiresAt = new Date(requestedAt.getTime() + this.getTokenTtlMs_())

    let verification
    if (existingVerifications.length) {
      verification = await this.authVerificationService_.update(
        {
          id: existingVerifications[0].id,
          code_provider: data.code_provider,
          provider_metadata: { token_hash: tokenHash },
          requested_at: requestedAt,
          verified_at: null,
        },
        sharedContext
      )
    } else {
      verification = await this.authVerificationService_.create(
        {
          auth_identity_id: data.auth_identity_id,
          entity_id: data.entity_id,
          entity_type: data.entity_type,
          code_provider: data.code_provider,
          provider_metadata: { token_hash: tokenHash },
          requested_at: requestedAt,
          metadata: data.metadata ?? null,
        },
        sharedContext
      )
    }

    return {
      ...verification,
      code: token,
      expires_at: expiresAt,
    }
  }

  async confirm(
    data: AuthTypes.ConfirmAuthVerificationDTO,
    sharedContext: Context = {}
  ): Promise<AuthTypes.ConfirmAuthVerificationResponse> {
    if (!data.code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Verification code is required"
      )
    }

    const [verification] = await this.authVerificationService_.list(
      {
        provider_metadata: {
          token_hash: hashVerificationToken(data.code),
        },
      },
      {},
      sharedContext
    )

    if (!verification || verification.verified_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Verification code is invalid or already used"
      )
    }

    if (
      data.code_provider &&
      data.code_provider !== verification.code_provider
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Verification code does not belong to provider "${data.code_provider}"`
      )
    }

    const expiresAt =
      new Date(verification.requested_at).getTime() + this.getTokenTtlMs_()

    if (expiresAt <= Date.now()) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Verification code has expired"
      )
    }

    return await this.authVerificationService_.update(
      {
        id: verification.id,
        verified_at: new Date(Date.now()),
      },
      sharedContext
    )
  }

  protected getTokenTtlMs_(): number {
    return getVerificationTokenTtlMs(this.options_.ttl_seconds ?? 900)
  }
}
