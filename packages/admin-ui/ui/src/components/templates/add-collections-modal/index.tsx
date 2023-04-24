import { useState } from "react"
import { useAdminCollections } from "medusa-react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import { SelectableTable } from "../selectable-table"
import useQueryFilters from "../../../hooks/use-query-filters"
import {
  columns,
  ProductCollectionHeader,
  ProductCollectionRow,
} from "./collection-table-config"

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

export type AddCollectionsModalProps = {
  onClose: () => void
  initialSelection: string[]
  onSave: (items: string[]) => void
}

export const AddCollectionsModal = ({
  initialSelection,
  onSave,
  onClose,
}: AddCollectionsModalProps) => {
  const [selectedIds, setSelectedIds] = useState(initialSelection)
  const params = useQueryFilters(defaultQueryProps)
  const {
    collections,
    isLoading,
    count = 0,
  } = useAdminCollections(params.queryObject, {
    keepPreviousData: true,
  })

  const handleSave = () => {
    onSave(selectedIds)
    close()
  }

  return (
    <Modal open handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={close}>
          <h2 className="inter-xlarge-semibold">Add Collections</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full flex flex-col justify-between min-h-[300px] h-full ">
            <SelectableTable
              columns={columns}
              data={collections || []}
              renderRow={ProductCollectionRow}
              renderHeaderGroup={ProductCollectionHeader}
              onChange={(ids) => setSelectedIds(ids)}
              selectedIds={selectedIds}
              isLoading={isLoading}
              resourceName="collections"
              totalCount={count}
              options={{
                enableSearch: true,
                searchPlaceholder: "Search by name or description...",
              }}
              {...params}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full gap-2">
            <Button variant="ghost" size="small" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
