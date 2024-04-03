import { RegionDTO } from "@medusajs/types"

type RegionHashToPaymentProvidersMap = { [key: string]: string[] }

type RemapRegionToPaymentProvidersOutput = {
  id: string
  payment_providers: string[]
}[]

export function remapRegionToPaymentProviders(
  createdRegions: RegionDTO[],
  regionHashToPaymentProvidersMap: RegionHashToPaymentProvidersMap
): RemapRegionToPaymentProvidersOutput {
  const upsertAndReplaceProvidersInput: RemapRegionToPaymentProvidersOutput = []

  for (const region of createdRegions) {
    Object.entries(regionHashToPaymentProvidersMap).some(
      ([regionHash, providers]) => {
        const regionObj = JSON.parse(regionHash)
        const match = Object.keys(regionObj).every(
          (key) => regionObj[key] === region[key]
        )
        if (match) {
          upsertAndReplaceProvidersInput.push({
            id: region.id,
            payment_providers: providers as string[],
          })
          return true
        }
        return false
      }
    )
  }

  return upsertAndReplaceProvidersInput
}
