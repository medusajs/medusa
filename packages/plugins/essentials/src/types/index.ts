export enum PluginModule {
  ESSENTIALS = "essentials",
}

export type EssentialsFeature = "email.invite" | "email.password-reset"

export type EssentialsPluginOptions = {
  /**
   * Features to enable.
   * Falls back to MEDUSA_ESSENTIALS_FEATURES environment variable if not provided, or "all" as last resort
   */
  features?: EssentialsFeature[] | "all" | "none"
  /**
   * Display name of the store, used e.g. in emails.
   * Falls back to MEDUSA_ESSENTIALS_STORE_NAME environment variable if not provided.
   */
  storeName?: string
  /**
   * Email address used to send emails.
   * Falls back to MEDUSA_ESSENTIALS_SENDER_EMAIL environment variable if not provided.
   */
  senderEmail?: string
}

export interface IEssentialsModuleService {
  isFeatureEnabled(feature: EssentialsFeature): Promise<boolean>
  getStoreName(): Promise<string | undefined>
  getSenderEmail(): Promise<string | undefined>
}
