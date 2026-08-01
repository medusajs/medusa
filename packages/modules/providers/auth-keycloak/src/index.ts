import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { KeycloakAuthService } from "./services/keycloak"

const services = [KeycloakAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
