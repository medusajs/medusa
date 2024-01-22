import { useSearchParams } from "react-router-dom"

export function useQueryParams<T extends string>(
  keys: T[]
): Record<T, string | undefined> {
  const [params] = useSearchParams()

  // Use a type assertion to initialize the result
  const result = {} as Record<T, string | undefined>

  keys.forEach((key) => {
    result[key] = params.get(key) || undefined
  })

  return result
}
