import { useAdminCollections } from "medusa-react"
import React, { useEffect, useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import {
  CollectionRow,
  CollectionsHeader,
  useCollectionColumns,
} from "../../../../../new/discount-form/condition-tables/shared/collection"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const ProductCollectionsConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const {
    isLoading: isLoadingCollections,
    count,
    collections,
    refetch,
  } = useAdminCollections(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const columns = useCollectionColumns()

  const onDeselect = () => {
    setSelectedResources([])
  }

  const onRemove = () => {
    removeConditionResources(selectedResources)
    onDeselect()
  }

  useEffect(() => {
    if (!isLoading) {
      refetch() // if loading is flipped, we've either added or removed resources -> refetch
      onDeselect()
    }
  }, [isLoading])

  return (
    <Modal.Content>
      <SelectableTable
        options={{
          enableSearch: false,
          tableActions: (
            <ExistingConditionTableActions
              numberOfSelectedRows={selectedResources.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
              deleting={isLoading}
            />
          ),
        }}
        resourceName="Collections"
        totalCount={count ?? 0}
        selectedIds={selectedResources}
        data={collections || []}
        columns={columns}
        isLoading={isLoadingCollections}
        onChange={(ids) => setSelectedResources(ids)}
        renderRow={CollectionRow}
        renderHeaderGroup={CollectionsHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductCollectionsConditionsTable
