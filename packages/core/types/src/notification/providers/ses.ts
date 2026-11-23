/**
 * Explicit AWS credentials for the SES provider.
 *
 * When omitted, the AWS SDK resolves credentials from its default chain
 * (environment variables, shared credentials file, instance profile, ...).
 */
export interface SesNotificationServiceCredentials {
  access_key_id: string
  secret_access_key: string
  session_token?: string
}

export interface SesNotificationServiceOptions {
  /**
   * The default sender email address. It must be verified in SES, or belong to a
   * verified domain.
   */
  from: string
  /**
   * The AWS region of the SES endpoint. Defaults to the region resolved by the
   * AWS SDK.
   */
  region?: string
  /**
   * The SES configuration set used for the sent emails.
   */
  configuration_set_name?: string
  /**
   * The reply-to addresses added to the sent emails.
   */
  reply_to_addresses?: string[]
  /**
   * Explicit AWS credentials. When omitted, the AWS SDK's default credential
   * chain is used.
   */
  credentials?: SesNotificationServiceCredentials
}
