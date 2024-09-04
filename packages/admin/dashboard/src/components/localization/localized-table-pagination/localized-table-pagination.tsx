import { Table } from "@medusajs/ui"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { useTranslation } from "react-i18next"

type LocalizedTablePaginationProps = Omit<
  ComponentPropsWithoutRef<typeof Table.Pagination>,
  "translations"
>

export const LocalizedTablePagination = forwardRef<
  ElementRef<typeof Table.Pagination>,
  LocalizedTablePaginationProps
>((props, ref) => {
  const { t } = useTranslation()

  const translations = {
    of: t("general.of"),
    results: t("general.results"),
    pages: t("general.pages"),
    prev: t("general.prev"),
    next: t("general.next"),
  }

  return <Table.Pagination {...props} translations={translations} ref={ref} />
})
LocalizedTablePagination.displayName = "LocalizedTablePagination"
