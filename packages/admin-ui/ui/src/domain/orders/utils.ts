/**
 * Transform filters widget data shape to order export strategy context object.
 */
export function transformFiltersAsExportContext(
  filters: Record<string, { filter: string[] }>
) {
  const context = {
    filterable_fields: {
      fulfillment_status: filters.fulfillment.filter,
      payment_status: filters.payment.filter,
      region_id: filters.region.filter,
      status: filters.status.filter,
      created_at: Object.keys(filters.date.filter || {}).reduce((prev, k) => {
        prev[k] = new Date(Number(filters.date.filter[k]) * 1000).toISOString()
        return prev
      }, {}),
    },
  }

  for (const k in context.filterable_fields) {
    if (
      context.filterable_fields[k] === null ||
      context.filterable_fields[k]?.length === 0
    ) {
      delete context.filterable_fields[k]
    }
  }

  return context
}
