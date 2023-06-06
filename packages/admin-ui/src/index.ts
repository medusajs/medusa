import { build } from "./build"
import { getDevMiddleware } from "./get-dev-middleware"
import { AdminBuildConfig } from "./types"
import { AdminDevConfig } from "./types/dev"
import { watchLocalExtensions } from "./utils/watch-extensions"

export { build, getDevMiddleware, watchLocalExtensions }
export type { AdminBuildConfig, AdminDevConfig }
