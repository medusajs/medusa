import { MedusaContextType } from "@medusajs/utils"

export const findMedusaContext = (args: any[]) => {
  if (!Array.isArray(args)) {
    return
  }

  for (let i = args.length; i--; ) {
    if (args[i]?.__type === MedusaContextType) {
      return args[i]
    }
  }

  return
}

export function removeTrailingUndefined(arr: unknown[]) {
  for (let i = arr.length; i && arr[--i] === undefined; ) {
    arr.pop()
  }
  return arr
}
