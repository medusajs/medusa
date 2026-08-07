import { ConfigModule } from "@medusajs/framework/types"

export function getAdminUrl(config: ConfigModule): string {
  const backendUrl =
    config.admin.backendUrl !== "/"
      ? config.admin.backendUrl
      : "http://localhost:9000"

  return `${backendUrl}${config.admin.path}`
}
