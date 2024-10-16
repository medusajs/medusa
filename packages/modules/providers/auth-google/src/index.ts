import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { GoogleAuthService } from "./services/google"

const services = [GoogleAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
