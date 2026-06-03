import { MedusaError } from "@medusajs/framework/utils"

export function resolveAllowedOptionValues<T>({
  optionTitle,
  value,
  optionValues,
  allowedValueIds,
}: {
  optionTitle: string,
  value: unknown,
  optionValues: T[] | undefined,
  allowedValueIds?: Set<string>
}): T {
    const valueNameOf = (v: any): unknown => v?.value?.value ?? v?.value
    const idOf = (v: any): string | undefined => v?.value?.id ?? v?.id

    const candidateValues = allowedValueIds
      ? optionValues?.filter((v) => {
          const id = idOf(v)
          return id ? allowedValueIds.has(id) : true
        })
      : optionValues

    const match = candidateValues?.find((v) => valueNameOf(v) === value)

    if (!match) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Option value ${value} does not exist for option ${optionTitle}`
      )
    }

    return match
  }