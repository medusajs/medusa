import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"

export type FeatureFlags = {
  view_configurations?: boolean
  translation?: boolean
  [key: string]: boolean | undefined
}

export const useFeatureFlags = () => {
  return useQuery<FeatureFlags>({
    queryKey: ["admin", "feature-flags"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ feature_flags: FeatureFlags }>(
        "/admin/feature-flags",
        {
          method: "GET",
        }
      )

      return response.feature_flags
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
}
