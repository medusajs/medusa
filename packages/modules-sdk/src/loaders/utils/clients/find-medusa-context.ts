import { MedusaContextType } from "@medusajs/utils"

export const findMedusaContext = (args: any[]) => {
  if (!Array.isArray(args)) {
    return
  }

  return args.find((argument) => argument?.__type === MedusaContextType)
}
