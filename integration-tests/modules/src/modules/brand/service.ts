import { MedusaService } from "@zjedene-medusa/utils"
import { Brand } from "./models/brand"

export class BrandModuleService extends MedusaService({
  Brand,
}) {}
