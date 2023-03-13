import { DeepPartial } from "./misc"

type GlobalsConfig = {
  base?: string
  backend?: string
  deployment?: boolean
}

type BuildConfig = {
  outDir?: string
}

export type AdminBuildConfig = {
  globals?: DeepPartial<GlobalsConfig>
  build?: DeepPartial<BuildConfig>
}
