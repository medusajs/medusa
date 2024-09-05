import { ModuleProviderExports } from "@medusajs/types"
import { GithubAuthService } from "./services/github"

const services = [GithubAuthService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
