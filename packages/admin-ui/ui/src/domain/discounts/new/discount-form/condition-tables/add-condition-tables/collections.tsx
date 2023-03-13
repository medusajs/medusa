import { useAdminCollections } from "medusa-react"
import { useState } from "react"
import Modal from "../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import {
  AddConditionSelectorProps,
  DiscountConditionOperator,
} from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import {
  CollectionRow,
  CollectionsHeader,
  useCollectionColumns,
} from "../shared/collection"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import AddConditionFooter from "./add-condition-footer"

const AddCollectionConditionSelector = ({
  onClose,
}: AddConditionSelectorProps) => {
  const params = useQueryFilters(defaultQueryProps)

  const { conditions } = useDiscountForm()

  const [items, setItems] = useState(
    conditions.product_collections?.items || []
  )
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.product_collections.operator
  )

  const { isLoading, count, collections } = useAdminCollections(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedCollections =
      collections?.filter((collections) => values.includes(collections.id)) ||
      []

    setItems(
      selectedCollections.map((collection) => ({
        id: collection.id,
        label: collection.title,
      }))
    )
  }

  const columns = useCollectionColumns()

  return (
    <>
      <Modal.Content>
        <ConditionOperator value={operator} onChange={setOperator} />
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Search by title...",
          }}
          resourceName="Collections"
          totalCount={count || 0}
          selectedIds={items?.map((c) => c.id)}
          data={collections}
          columns={columns}
          isLoading={isLoading}
          onChange={changed}
          renderRow={CollectionRow}
          renderHeaderGroup={CollectionsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <AddConditionFooter
          type="product_collections"
          items={items}
          onClose={onClose}
          operator={operator}
        />
      </Modal.Footer>
    </>
  )
}

export default AddCollectionConditionSelector
