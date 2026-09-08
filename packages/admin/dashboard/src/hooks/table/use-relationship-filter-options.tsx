import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { useQueries } from "@tanstack/react-query"
import { sdk } from "../../lib/client"

export interface RelationshipFilterConfig {
  field: string
  config: NonNullable<
    NonNullable<HttpTypes.AdminColumn["filter"]>["relationship"]
  >
}

export function useRelationshipFilterOptions(
  configs: RelationshipFilterConfig[]
) {
  const queries = useQueries({
    queries: configs.map((config) => ({
      queryKey: ["relationship-filter-options", config.config.endpoint],
      queryFn: async () => {
        const response = await sdk.client.fetch<Record<string, any>>(
          config.config.endpoint,
          {
            method: "GET",
            query: {
              fields: `${config.config.value_field},${config.config.display_field}`,
              limit: 1000,
            },
          }
        )

        const dataKey = Object.keys(response).find((key) =>
          Array.isArray(response[key])
        )

        if (!dataKey) {
          console.warn(
            `Could not find data array in response from ${config.config.endpoint}`
          )
          return []
        }

        const data = response[dataKey] as any[]

        return data.map((item) => ({
          label: item[config.config.display_field],
          value: item[config.config.value_field],
        }))
      },
      staleTime: 5 * 60 * 1000,
      enabled: configs.length > 0,
    })),
  })

  const optionsMap = useMemo(() => {
    const map: Record<string, Array<{ label: string; value: string }>> = {}

    configs.forEach((config, index) => {
      const query = queries[index]
      if (query.data) {
        map[config.field] = query.data
      }
    })

    return map
  }, [configs, queries])

  const isLoading = queries.some((q) => q.isLoading)

  return {
    options: optionsMap,
    isLoading,
  }
}
