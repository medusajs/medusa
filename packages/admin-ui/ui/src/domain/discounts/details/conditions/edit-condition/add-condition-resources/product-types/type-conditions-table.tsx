import { useAdminProductTypes } from "medusa-react"
import { useEffect, useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TypeRow,
  TypesHeader,
  useTypesColumns,
} from "../../../../../new/discount-form/condition-tables/shared/types"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const ProductTypesConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const { condition, removeConditionResources, isLoading } =
    useEditConditionContext()

  const {
    isLoading: isLoadingTypes,
    count,
    product_types,
    refetch,
  } = useAdminProductTypes(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const columns = useTypesColumns()

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
        resourceName="Types"
        totalCount={count ?? 0}
        selectedIds={selectedRowIds}
        data={product_types || []}
        columns={columns}
        isLoading={isLoadingTypes}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={TypeRow}
        renderHeaderGroup={TypesHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductTypesConditionsTable
