import { useAdminProductTags } from "medusa-react"
import React, { useState } from "react"
import Spinner from "../../../../../../components/atoms/spinner"
import Modal from "../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import {
  AddConditionSelectorProps,
  DiscountConditionOperator,
} from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import { TagColumns, TagHeader, TagRow } from "../shared/tags"
import AddConditionFooter from "./add-condition-footer"

const AddTagConditionSelector = ({ onClose }: AddConditionSelectorProps) => {
  const params = useQueryFilters(defaultQueryProps)

  const { conditions } = useDiscountForm()

  const [items, setItems] = useState(conditions.product_tags?.items || [])
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.product_tags.operator
  )

  const { isLoading, count, product_tags } = useAdminProductTags(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTags =
      product_tags?.filter((t) => values.includes(t.id)) || []

    setItems(selectedTags.map((t) => ({ id: t.id, label: t.value })))
  }

  return (
    <>
      <Modal.Content>
        <ConditionOperator value={operator} onChange={setOperator} />
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Search by tag...",
          }}
          resourceName="Tags"
          totalCount={count || 0}
          selectedIds={items.map((i) => i.id)}
          data={product_tags}
          columns={TagColumns}
          isLoading={isLoading}
          onChange={changed}
          renderRow={TagRow}
          renderHeaderGroup={TagHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <AddConditionFooter
          type="product_tags"
          items={items}
          onClose={onClose}
          operator={operator}
        />
      </Modal.Footer>
    </>
  )
}

export default AddTagConditionSelector
