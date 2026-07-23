import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useApiKeys } from "../../../../../hooks/api/api-keys"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../../lib/table/table-adapters"
import { ApiKeyRowActions } from "./api-key-row-actions"
// Registers the api_key_token / api_key_type / api_key_status renderers.
import "./api-key-table-renderers"

type ApiKeyType = "publishable" | "secret"

export function createApiKeyTableAdapter({
  t,
  keyType,
}: {
  t: TFunction<"translation", undefined>
  keyType: ApiKeyType
}): TableAdapter<HttpTypes.AdminApiKeyResponse["api_key"]> {
  return createTableAdapter<HttpTypes.AdminApiKeyResponse["api_key"]>({
    entity: "api-keys",
    // Publishable and secret keys are the SAME entity; scope views per type so
    // they don't share saved configurations.
    viewConfigurationKey: `api-keys-${keyType}`,
    queryPrefix: keyType === "secret" ? "sk" : "pk",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("general.noRecordsMessage"),
      },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    useData: (fields, params) => {
      const { api_keys, count, isError, error, isLoading } = useApiKeys(
        {
          fields,
          ...params,
          type: keyType,
        },
        {
          placeholderData: (previousData, previousQuery: any) => {
            const prevFields =
              previousQuery?.[previousQuery?.length - 1]?.query?.fields
            if (prevFields && prevFields !== fields) {
              return undefined
            }
            return previousData
          },
        }
      )
      return { data: api_keys, count, isLoading, isError, error }
    },
    getRowHref: (row) => `${row.id}`,
    renderRowActions: (row) => <ApiKeyRowActions apiKey={row as any} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "title",
        "token",
        "created_at",
        "updated_at",
        "deleted_at",
        "revoked_at",
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTERS.includes(column.field)

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
        }
      })
    },
  })
}

// eslint-disable-next-line max-len
export function useApiKeyTableAdapter(
  keyType: ApiKeyType
): TableAdapter<HttpTypes.AdminApiKeyResponse["api_key"]> {
  const { t } = useTranslation()
  return useMemo(() => createApiKeyTableAdapter({ t, keyType }), [t, keyType])
}
