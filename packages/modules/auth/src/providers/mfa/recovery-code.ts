import { Context, ModulesSdkTypes } from "@medusajs/framework/types"
import { AuthMfaRecoveryCode } from "@models"
import { RecoveryCodeAuthMfaProvider } from "../../services/mfa-provider"
import {
  generateRecoveryCode,
  hashRecoveryCode,
  verifyRecoveryCodeHash,
} from "../../utils/mfa"

type InjectedDependencies = {
  authMfaRecoveryCodeService: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthMfaRecoveryCode
  >
}

export class RecoveryCodeMfaProvider implements RecoveryCodeAuthMfaProvider {
  static identifier = "recovery_code"

  readonly method = RecoveryCodeMfaProvider.identifier as "recovery_code"

  protected authMfaRecoveryCodeService_: ModulesSdkTypes.IMedusaInternalService<
    typeof AuthMfaRecoveryCode
  >

  constructor({ authMfaRecoveryCodeService }: InjectedDependencies) {
    this.authMfaRecoveryCodeService_ = authMfaRecoveryCodeService
  }

  async canVerifyForAuthIdentity(
    data: { auth_identity_id: string },
    sharedContext: Context = {}
  ): Promise<boolean> {
    const [code] = await this.authMfaRecoveryCodeService_.list(
      {
        auth_identity_id: data.auth_identity_id,
      },
      { select: ["id"] },
      sharedContext
    )

    return !!code
  }

  async generateCodes(
    data: { auth_identity_id: string; count: number },
    sharedContext: Context = {}
  ): Promise<string[]> {
    const existingCodes = await this.authMfaRecoveryCodeService_.list(
      { auth_identity_id: data.auth_identity_id },
      { select: ["id"] },
      sharedContext
    )

    if (existingCodes.length) {
      await this.authMfaRecoveryCodeService_.delete(
        existingCodes.map((code) => code.id),
        sharedContext
      )
    }

    const codes = Array.from({ length: data.count }, () =>
      generateRecoveryCode()
    )

    await this.authMfaRecoveryCodeService_.create(
      await Promise.all(
        codes.map(async (code) => ({
          auth_identity_id: data.auth_identity_id,
          code_hash: await hashRecoveryCode(code),
        }))
      ),
      sharedContext
    )

    return codes
  }

  async verify(
    data: { auth_identity_id: string; code: string },
    sharedContext: Context = {}
  ): Promise<boolean> {
    const recoveryCodes = await this.authMfaRecoveryCodeService_.list(
      {
        auth_identity_id: data.auth_identity_id,
      },
      { select: ["id", "code_hash"] },
      sharedContext
    )

    let recoveryCode: (typeof recoveryCodes)[number] | undefined

    for (const candidate of recoveryCodes) {
      if (await verifyRecoveryCodeHash(candidate.code_hash, data.code)) {
        recoveryCode = candidate
        break
      }
    }

    if (!recoveryCode) {
      return false
    }

    await this.authMfaRecoveryCodeService_.delete(recoveryCode.id, sharedContext)

    return true
  }
}
