import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const MODULES_QUERY_KEY = "modules" as const
export const modulesQueryKeys = queryKeysFactory(MODULES_QUERY_KEY)

export const RBAC_MODULE_KEY = "rbac"

export const modulesQueryOptions = {
  queryKey: modulesQueryKeys.list(),
  queryFn: () => sdk.admin.module.list(),
  // Installed modules only change when the server restarts.
  staleTime: Infinity,
}

export const useIsModuleInstalled = (key: string) => {
  const { data, isLoading } = useQuery(modulesQueryOptions)

  return {
    isInstalled: !!data?.modules?.some((module) => module.key === key),
    isLoading,
  }
}
