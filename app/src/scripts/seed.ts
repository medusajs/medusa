import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Minimal seed entrypoint. Runs via `npm run seed` (or by setting
 * MEDUSA_RUN_SEED=true on the container). Extend this to populate regions,
 * sales channels, products, etc. — see the Medusa docs for the full
 * `createRegionsWorkflow`, `createSalesChannelsWorkflow`, ... helpers.
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  logger.info("Seed script ran. No data seeded — edit src/scripts/seed.ts to add your own.")
}
