import { Alert, Button, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { BulkFulfillOrdersResult } from "../../../../../../hooks/api/orders"

type BulkFulfillResultSummaryProps = {
  result: BulkFulfillOrdersResult
  onDismiss: () => void
}

/**
 * Renders the structured, per-order outcome of a bulk Fulfill action, per
 * the design spec's Error handling section: a "<succeeded> fulfilled,
 * <failed> failed" count, plus - when there are failures - each failed
 * order's own id and error message. A single generic toast would collapse
 * which orders failed and why into one undifferentiated message, so this
 * is rendered inline instead and stays on screen until dismissed.
 *
 * Dismissal is owned by the caller (`onDismiss` clears the result from
 * `ReadyToShipTable`'s own state) rather than `Alert`'s own `dismissible`
 * prop, since that prop only toggles the alert's internal visibility - it
 * wouldn't let a later bulk action's result replace this one reliably.
 */
export const BulkFulfillResultSummary = ({
  result,
  onDismiss,
}: BulkFulfillResultSummaryProps) => {
  const { t } = useTranslation()
  const { succeeded, failed } = result
  const hasFailures = failed.length > 0

  return (
    <div className="px-6 py-4">
      <Alert
        variant={hasFailures ? "warning" : "success"}
        dismissible={false}
        className="flex flex-col gap-y-3"
      >
        <div className="flex items-center justify-between gap-x-4">
          <Text size="small" weight="plus">
            {t("orders.readyToShip.bulkFulfillSummary", {
              succeeded: succeeded.length,
              failed: failed.length,
            })}
          </Text>
          <Button size="small" variant="transparent" onClick={onDismiss}>
            {t("actions.close")}
          </Button>
        </div>
        {hasFailures && (
          <div className="flex flex-col gap-y-1">
            {failed.map((failure) => (
              <Text
                key={failure.order_id}
                size="small"
                className="text-ui-fg-subtle"
              >
                {failure.order_id}: {failure.error}
              </Text>
            ))}
          </div>
        )}
      </Alert>
    </div>
  )
}
