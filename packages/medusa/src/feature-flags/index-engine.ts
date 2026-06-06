import { FlagSettings } from "@zjedene-medusa/framework/feature-flags"

const IndexEngineFeatureFlag: FlagSettings = {
  key: "index_engine",
  default_val: false,
  env_key: "MEDUSA_FF_INDEX_ENGINE",
  description: "Enable Medusa to use the index engine in some part of the core",
}

export default IndexEngineFeatureFlag
