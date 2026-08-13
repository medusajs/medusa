import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { OidcAuthService } from "./services/oidc"

const services = [OidcAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
