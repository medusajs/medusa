import { MedusaAppOutput } from "@medusajs/modules-sdk"

export class MedusaAppHelper {
  private static medusaApp_: MedusaAppOutput | null

  public static clear(): void {
    MedusaAppHelper.medusaApp_ = null
  }

  public static get(): MedusaAppOutput | null {
    return MedusaAppHelper.medusaApp_
  }

  public static getOrThrow(): MedusaAppOutput {
    if (MedusaAppHelper.medusaApp_ === null) {
      throw "not started"
    }

    return MedusaAppHelper.medusaApp_
  }

  public static set(medusaApp: MedusaAppOutput): void {
    MedusaAppHelper.medusaApp_ = medusaApp
  }
}
