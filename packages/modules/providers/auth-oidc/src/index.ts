import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import licenseLoader from "./loaders/license"
import { OidcAuthService } from "./services/oidc"

const services = [OidcAuthService]
const loaders = [licenseLoader]

export default ModuleProvider(Modules.AUTH, {
  services,
  loaders,
})
