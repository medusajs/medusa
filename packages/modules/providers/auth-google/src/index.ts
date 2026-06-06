import { ModuleProvider, Modules } from "@zjedene-medusa/framework/utils"
import { GoogleAuthService } from "./services/google"

const services = [GoogleAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
