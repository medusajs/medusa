import { ModuleProvider, Modules } from "@zjedene-medusa/framework/utils"
import { GithubAuthService } from "./services/github"

const services = [GithubAuthService]

export default ModuleProvider(Modules.AUTH, {
  services,
})
