import { useAdminProductTypes } from "medusa-react"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../../../components/fundamentals/button"
import Modal from "../../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TypeRow,
  TypesHeader,
  useTypesColumns,
} from "../../../../../new/discount-form/condition-tables/shared/types"
import { useEditConditionContext } from "../../edit-condition-provider"

const AddTypesConditionsScreen = () => {
  const { t } = useTranslation()
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const columns = useTypesColumns()

  const {
    isLoading: isLoadingTypes,
    count,
    product_types,
    refetch,
  } = useAdminProductTypes(params.queryObject, {
    keepPreviousData: true,
  })

  const { saveAndClose, saveAndGoBack } = useEditConditionContext()

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: t("product-types-search", "Search..."),
          }}
          resourceName="Types"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={product_types || []}
          columns={columns}
          isLoading={isLoadingTypes}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={TypeRow}
          renderHeaderGroup={TypesHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button variant="secondary" size="small" onClick={pop}>
            {t("product-types-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources, () => refetch())}
          >
            {t("product-types-save-and-go-back", "Save and go back")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            {t("product-types-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddTypesConditionsScreen
