import type { LoadedModule } from "@medusajs/types"
import { join } from "path"
import { FileSystem } from "../common/file-system"
import { toCamelCase } from "../common/to-camel-case"
import { toUnixSlash } from "../common/to-unix-slash"
import { upperCaseFirst } from "../common/upper-case-first"
import { Modules } from "./definition"

/**
 * For known services that has interfaces, we will set the container
 * type to the interface than the actual service implementation.
 *
 * The idea is to provide more precise types.
 */
const SERVICES_INTERFACES = {
  [Modules.AUTH]: "IAuthModuleService",
  [Modules.CACHE]: "ICacheService",
  [Modules.CART]: "ICartModuleService",
  [Modules.CUSTOMER]: "ICustomerModuleService",
  [Modules.EVENT_BUS]: "IEventBusModuleService",
  [Modules.INVENTORY]: "IInventoryService",
  [Modules.PAYMENT]: "IPaymentModuleService",
  [Modules.PRICING]: "IPricingModuleService",
  [Modules.PRODUCT]: "IProductModuleService",
  [Modules.PROMOTION]: "IPromotionModuleService",
  [Modules.SALES_CHANNEL]: "ISalesChannelModuleService",
  [Modules.TAX]: "ITaxModuleService",
  [Modules.FULFILLMENT]: "IFulfillmentModuleService",
  [Modules.STOCK_LOCATION]: "IStockLocationService",
  [Modules.USER]: "IUserModuleService",
  [Modules.WORKFLOW_ENGINE]: "IWorkflowEngineService",
  [Modules.REGION]: "IRegionModuleService",
  [Modules.ORDER]: "IOrderModuleService",
  [Modules.API_KEY]: "IApiKeyModuleService",
  [Modules.STORE]: "IStoreModuleService",
  [Modules.CURRENCY]: "ICurrencyModuleService",
  [Modules.FILE]: "IFileModuleService",
  [Modules.NOTIFICATION]: "INotificationModuleService",
  [Modules.LOCKING]: "ILockingModule",
  [Modules.SETTINGS]: "ISettingsModuleService",
  [Modules.CACHING]: "ICachingModuleService",
  [Modules.TRANSLATION]: "ITranslationModuleService",
  [Modules.RBAC]: "IRbacModuleService",
}

/**
 * Modules registered inside the config file points to one
 * of the following paths.
 *
 * - A package name
 * - A relative application import
 * - Or an absolute path using `require.resolve`
 *
 * In case of a relative import, we mutate the path to resolve properly
 * when the output file is inside the ".medusa/types" directory.
 * For example:
 *
 * => "./src/modules/brand" will become "../../src/modules/brand"
 *
 * Package names and absolute paths are left as it is.
 */
function normalizeModuleResolvePath(modulePath: string) {
  return modulePath.startsWith("./") || modulePath.startsWith("../")
    ? toUnixSlash(join("../", "../", modulePath))
    : modulePath
}

/**
 * Creates the "modules-bindings.d.ts" file with container mappings
 * for the modules enabled inside a user's project.
 */
export async function generateContainerTypes(
  modules: Record<string, LoadedModule | LoadedModule[]>,
  {
    outputDir,
    interfaceName,
  }: {
    outputDir: string
    interfaceName: string
  }
) {
  const { imports, mappings } = Object.keys(modules).reduce(
    (result, key) => {
      const services = Array.isArray(modules[key])
        ? modules[key]
        : [modules[key]]

      services.forEach((service) => {
        if (!service.__definition.resolvePath) {
          return
        }

        /**
         * Key registered within the container
         */
        const key = service.__definition.key
        const interfaceKey = `'${key}'`

        if (SERVICES_INTERFACES[key]) {
          result.imports.push(
            `import type { ${SERVICES_INTERFACES[key]} } from '@medusajs/framework/types'`
          )
          result.mappings.push(`${interfaceKey}: ${SERVICES_INTERFACES[key]}`)
          return
        }

        /**
         * @todo. The property should exist on "LoadedModule"
         */
        let servicePath: string = normalizeModuleResolvePath(
          service.__definition.resolvePath
        )

        /**
         * We create the service name (aka default import name) from the
         * service key that is registered inside the container.
         */
        const serviceName = upperCaseFirst(toCamelCase(key))

        result.imports.push(`import type ${serviceName} from '${servicePath}'`)
        result.mappings.push(
          `${interfaceKey}: InstanceType<(typeof ${serviceName})['service']>`
        )
      })
      return result
    },
    {
      imports: [],
      mappings: [],
    } as {
      imports: string[]
      mappings: string[]
    }
  )

  const fileSystem = new FileSystem(outputDir)
  const fileName = "modules-bindings.d.ts"
  const fileContents = `${imports.join(
    "\n"
  )}\n\ndeclare module '@medusajs/framework/types' {
  interface ${interfaceName} {
    ${mappings.join(",\n    ")}
  }
}`

  await fileSystem.create(fileName, fileContents)
}
