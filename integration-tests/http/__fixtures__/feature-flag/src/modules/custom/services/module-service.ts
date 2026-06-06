import { IModuleService } from "@zjedene-medusa/types"
import { MedusaContext } from "@zjedene-medusa/utils"

// @ts-expect-error
export class ModuleService implements IModuleService {
  public property = "value"

  constructor() {}
  async methodName(input, @MedusaContext() context) {
    return input + " called"
  }
}
