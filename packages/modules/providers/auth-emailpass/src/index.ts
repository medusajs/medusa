import { ModuleProvider, Modules } from "@zjedene-medusa/framework/utils"
import { EmailPassAuthService } from "./services/emailpass"

const services = [EmailPassAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
