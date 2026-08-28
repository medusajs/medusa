import {
  ContainerRegistrationKeys,
  dynamicImport,
} from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { readdir } from "fs/promises"
import { isObject } from "lodash"
import { join } from "path"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_RBAC: true,
  },
  testSuite: ({ getContainer }) => {
    describe("RBAC - Endpoint entities match policy resources", () => {
      it("should have all endpoint entities present in policy resources", async () => {
        const adminEndpointEntities = await collectAdminEndpointEntities()
        const policyResourceEntities = await collectPolicyResourceEntities(
          getContainer()
        )

        const missingInPolicies = [...adminEndpointEntities].filter(
          (entity) => !policyResourceEntities.has(entity)
        )

        if (missingInPolicies.length > 0) {
          console.log(
            `\nMissing in policy resources (${missingInPolicies.length}):\n` +
              missingInPolicies.sort().join(", ")
          )
        }

        expect(adminEndpointEntities.size).toBeGreaterThan(0)
        expect(missingInPolicies).toEqual([])
        expect(policyResourceEntities.size).toBeGreaterThan(0)
      })
    })
  },
})

/**
 * Collect all Entities from admin endpoint query-config files
 */
async function collectAdminEndpointEntities(): Promise<Set<string>> {
  const entities = new Set<string>()
  const adminApiPath = join(__dirname, "../../../packages/medusa/src/api/admin")

  try {
    const directories = await readdir(adminApiPath, { withFileTypes: true })

    for (const dir of directories) {
      if (!dir.isDirectory()) {
        continue
      }

      const queryConfigPath = join(adminApiPath, dir.name, "query-config.ts")

      try {
        // Use dynamicImport to load the module and access the Entities enum
        const moduleExports = await dynamicImport(queryConfigPath)

        if (isObject(moduleExports.Entities)) {
          for (const entity of Object.values(
            moduleExports.Entities as Record<string, string>
          )) {
            entities.add(entity)
          }
        }
      } catch (error) {
        continue
      }
    }
  } catch (error) {
    console.error("Error reading admin API directory:", error)
  }

  return entities
}

/**
 * Collect all unique resources of the persisted policies.
 */
async function collectPolicyResourceEntities(
  container: MedusaContainer
): Promise<Set<string>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: policies } = await query.graph({
    entity: "rbac_policy",
    fields: ["resource"],
  })

  return new Set((policies ?? []).map((policy) => policy.resource as string))
}
