import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Modal from "../../../../components/molecules/modal"
import { useDebounce } from "../../../../hooks/use-debounce"
import SalesChannelTable, {
  SalesChannelTableActions,
  useSalesChannelsTableColumns,
} from "./table"
import { useSalesChannelsModal } from "./use-sales-channels-modal"

const LIMIT = 15

const AvailableScreen = () => {
  const { source, onSave } = useSalesChannelsModal()

  const [columns] = useSalesChannelsTableColumns()
  const [query, setQuery] = useState<string | undefined>(undefined)
  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const deboucedQuery = useDebounce(query, 500)

  const filteredData = React.useMemo(() => {
    if (!deboucedQuery) {
      return source
    }

    return source?.filter(({ name, description }) => {
      return (
        name.toLowerCase().includes(deboucedQuery.toLowerCase()) ||
        description?.toLowerCase().includes(deboucedQuery.toLowerCase())
      )
    })
  }, [source, deboucedQuery])

  const state = useTable(
    {
      // @ts-ignore
      columns,
      data: filteredData,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
      pageCount: Math.ceil(filteredData.length / LIMIT),
    },
    usePagination,
    useRowSelect
  )

  const onDeselect = () => {
    setSelectedRowIds([])
    state.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    const channels = source.filter((sc) => !selectedRowIds.includes(sc.id))
    onSave(channels)
    onDeselect()
  }

  return (
    <Modal.Content>
      <SalesChannelTable
        count={source.length}
        tableAction={
          <SalesChannelTableActions
            numberOfSelectedRows={selectedRowIds.length}
            onRemove={onRemove}
            onDeselect={onDeselect}
          />
        }
        setSelectedRowIds={setSelectedRowIds}
        limit={15}
        offset={offset}
        setOffset={setOffset}
        setQuery={setQuery}
        tableState={state}
      />
    </Modal.Content>
  )
}

export default AvailableScreen
