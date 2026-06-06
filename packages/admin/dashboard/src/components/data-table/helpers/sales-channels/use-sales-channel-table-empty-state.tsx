import { DataTableEmptyStateProps } from "@zjedene-medusa/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

export const useSalesChannelTableEmptyState = (): DataTableEmptyStateProps => {
  const { t } = useTranslation()

  return useMemo(() => {
    const content: DataTableEmptyStateProps = {
      empty: {
        heading: t("salesChannels.list.empty.heading"),
        description: t("salesChannels.list.empty.description"),
      },
      filtered: {
        heading: t("salesChannels.list.filtered.heading"),
        description: t("salesChannels.list.filtered.description"),
      },
    }

    return content
  }, [t])
}
