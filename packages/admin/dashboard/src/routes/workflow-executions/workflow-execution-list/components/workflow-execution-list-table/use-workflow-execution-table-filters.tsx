import { useTranslation } from "react-i18next"
import { Filter } from "../../../../../components/table/data-table"
import { getTransactionState } from "../../../utils"
import { TransactionState } from "../../../types"

export const useWorkflowExecutionTableFilters = () => {
  const { t } = useTranslation()

  const filters: Filter[] = [
    {
      label: t("workflowExecutions.workflowIdLabel"),
      key: "workflow_id",
      type: "string",
    },
    {
      label: t("fields.status"),
      key: "state",
      type: "select",
      multiple: true,
      options: Object.values(TransactionState).map((state) => ({
        label: getTransactionState(t, state),
        value: state,
      })),
    },
    { label: t("fields.createdAt"), key: "created_at", type: "date" },
  ]

  return filters
}
