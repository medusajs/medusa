import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import { ExportModule, Modules } from "@medusajs/utils"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export default ExportModule(Modules.CURRENCY, {
  service,
  loaders,
})

/*export function ExportModule<
  const Service extends Constructor<any>,
  DMLObjects = (typeof service)["$dmlObjects"]
>(moduleName: string, { service, loaders }: ModuleExports<Service>) {
  const dmlObjects = service[MedusaServiceDmlObjectSymbolFunction]?.()

  return {
    service,
    loaders,
    links: buildLinkConfigFromDmlObjects<DMLObjects>(dmlObjects),
  }
}

type entities = (typeof service)["$dmlObjects"]

const test = ExportModule(Modules.CURRENCY, {
  service,
  loaders,
})*/
