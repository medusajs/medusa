type QueryGraphConfig = {
  entity: string
  fields?: string[]
  filters?: Record<string, any>
  pagination?: {
    order?: Record<string, string>
    take?: number
  }
  withDeleted?: boolean
}

/**
 * In-memory stand-in for the application query graph the index module
 * consumes data from. Tests seed it with records per entity alias and the
 * fake honors the filter/pagination shapes the module relies on:
 *
 * - `filters.id` as an array or single value (event consumption)
 * - `filters.id.$gt` + order/take (data synchronizer cursor pagination)
 *
 * Every call is recorded in `calls` for tests that want to assert how the
 * module queried the data source.
 */
export class FakeQuery {
  protected data: Map<string, Record<string, any>[]> = new Map()

  calls: QueryGraphConfig[] = []

  seed(entity: string, records: Record<string, any>[]) {
    this.data.set(entity, records)
    return this
  }

  reset() {
    this.data.clear()
    this.calls = []
  }

  graph = async (config: QueryGraphConfig): Promise<{ data: any[] }> => {
    this.calls.push(JSON.parse(JSON.stringify(config)))

    let records = [...(this.data.get(config.entity) ?? [])]

    const idFilter = config.filters?.id

    if (Array.isArray(idFilter)) {
      records = records.filter((record) => idFilter.includes(record.id))
    } else if (typeof idFilter === "string") {
      records = records.filter((record) => record.id === idFilter)
    } else if (idFilter && typeof idFilter === "object" && "$gt" in idFilter) {
      records = records.filter((record) => record.id > idFilter.$gt)
    }

    const updatedAtFilter = config.filters?.updated_at
    if (updatedAtFilter?.$gt) {
      records = records.filter(
        (record) =>
          new Date(record.updated_at as string) >
          new Date(updatedAtFilter.$gt as string)
      )
    }

    const idOrder = config.pagination?.order?.id
    if (idOrder) {
      const direction = idOrder.toLowerCase() === "desc" ? -1 : 1
      records.sort((a, b) =>
        a.id === b.id ? 0 : a.id > b.id ? direction : -direction
      )
    }

    if (typeof config.pagination?.take === "number") {
      records = records.slice(0, config.pagination.take)
    }

    return { data: JSON.parse(JSON.stringify(records)) }
  }
}
