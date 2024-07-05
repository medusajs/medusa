import { ModuleProviderExports } from "@medusajs/types"
import { S3FileService } from "./services/s3-file"

const services = [S3FileService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
