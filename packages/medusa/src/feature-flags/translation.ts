import { FlagSettings } from "@medusajs/framework/feature-flags"

const TranslationFeatureFlag: FlagSettings = {
  key: "translation",
  default_val: false,
  env_key: "MEDUSA_FF_TRANSLATION",
  description: "Enable multi-language support and entity translations",
}

export default TranslationFeatureFlag
