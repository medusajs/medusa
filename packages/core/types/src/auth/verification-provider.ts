import { AuthTypes, Context } from ".."

/**
 * The base interface that all auth verification providers must implement.
 *
 *
 * @since 2.16.0
 */
export interface IAuthVerificationProvider {
  /**
   * The identifier of the verification provider, such as `token`.
   */
  readonly identifier: string

  /**
   * This method requests a verification for an entity. If the entity is already verified, it returns the auth verification record.
   *
   * @param data - The data required to request a verification.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The verification response, including any provider-specific data such as a code.
   */
  request(
    data: AuthTypes.RequestAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.RequestAuthVerificationResponse>

  /**
   * This method confirms a verification.
   *
   * @param data - The data required to confirm a verification.
   * @param sharedContext - A context used to share resources between the application and the module.
   * @returns The confirmed verification.
   */
  confirm(
    data: AuthTypes.ConfirmAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ConfirmAuthVerificationResponse>
}
