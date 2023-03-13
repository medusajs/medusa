import { useAdminProductTags } from "medusa-react"
import { useEffect, useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TagColumns,
  TagHeader,
  TagRow,
} from "../../../../../new/discount-form/condition-tables/shared/tags"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const ProductTagsConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const { condition, removeConditionResources, isLoading } =
    useEditConditionContext()

  const {
    isLoading: isLoadingTags,
    count,
    product_tags,
    refetch,
  } = useAdminProductTags(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const onDeselect = () => {
    setSelectedRowIds([])
  }

  const onRemove = () => {
    removeConditionResources(selectedRowIds)
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
              numberOfSelectedRows={selectedRowIds.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
              deleting={isLoading}
            />
          ),
        }}
        resourceName="Tags"
        totalCount={count ?? 0}
        selectedIds={selectedRowIds}
        data={product_tags || []}
        columns={TagColumns}
        isLoading={isLoadingTags}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={TagRow}
        renderHeaderGroup={TagHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductTagsConditionsTable
