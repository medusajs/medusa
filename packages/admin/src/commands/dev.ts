import type { AdminDevConfig } from "@medusajs/admin-ui"
import { dev as devAdmin } from "@medusajs/admin-ui"

export default async function dev(args: AdminDevConfig) {
  await devAdmin(args)
}
