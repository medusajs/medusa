export enum PluginModule {
  STARTER_KIT = "starter_kit",
}

export type StarterKitFeature = "email.invite" | "email.password-reset"

export type StarterKitPluginOptions = {
  /**
   * Features to enable.
   * Falls back to MEDUSA_STARTER_KIT_FEATURES environment variable if not provided, or "all" as last resort
   */
  features?: StarterKitFeature[] | "all" | "none"
  /**
   * Display name of the store, used e.g. in emails.
   * Falls back to MEDUSA_STARTER_KIT_STORE_NAME environment variable if not provided.
   */
  storeName?: string
  /**
   * Email address used to send emails.
   * Falls back to MEDUSA_STARTER_KIT_SENDER_EMAIL environment variable if not provided.
   */
  senderEmail?: string
}

export interface IStarterKitModuleService {
  isFeatureEnabled(feature: StarterKitFeature): Promise<boolean>
  getStoreName(): Promise<string | undefined>
  getSenderEmail(): Promise<string | undefined>
}
