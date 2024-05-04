import { useTranslation } from "react-i18next"
import { Filter } from "../../../components/table/data-table"
import { useCustomerGroups } from "../../api/customer-groups"

const excludeableFields = ["groups"] as const

export const useCustomerTableFilters = (
  exclude?: (typeof excludeableFields)[number][]
) => {
  const { t } = useTranslation()

  const isGroupsExcluded = exclude?.includes("groups")

  const { customer_groups } = useCustomerGroups(
    {
      limit: 1000,
      expand: "",
    },
    {
      enabled: !isGroupsExcluded,
    }
  )

  let filters: Filter[] = []

  if (customer_groups && !isGroupsExcluded) {
    const customerGroupFilter: Filter = {
      key: "groups",
      label: t("customers.groups"),
      type: "select",
      multiple: true,
      options: customer_groups.map((s) => ({
        label: s.name,
        value: s.id,
      })),
    }

    filters = [...filters, customerGroupFilter]
  }

  const hasAccountFilter: Filter = {
    key: "has_account",
    label: t("fields.account"),
    type: "select",
    options: [
      {
        label: t("customers.registered"),
        value: "true",
      },
      {
        label: t("customers.guest"),
        value: "false",
      },
    ],
  }

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  filters = [...filters, hasAccountFilter, ...dateFilters]

  return filters
}
