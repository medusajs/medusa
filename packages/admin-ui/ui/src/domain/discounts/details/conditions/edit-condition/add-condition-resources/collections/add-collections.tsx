import { useAdminCollections } from "medusa-react"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../../../components/fundamentals/button"
import Modal from "../../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  CollectionRow,
  CollectionsHeader,
  useCollectionColumns,
} from "../../../../../new/discount-form/condition-tables/shared/collection"
import { useEditConditionContext } from "../../edit-condition-provider"

const AddCollectionConditionsScreen = () => {
  const { t } = useTranslation()
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const columns = useCollectionColumns()

  const { isLoading, count, collections, refetch } = useAdminCollections(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const { saveAndClose, saveAndGoBack } = useEditConditionContext()

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: t("collections-search", "Search..."),
          }}
          resourceName="Collections"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={collections || []}
          columns={columns}
          isLoading={isLoading}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={CollectionRow}
          renderHeaderGroup={CollectionsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="space-x-xsmall flex w-full justify-end">
          <Button variant="secondary" size="small" onClick={pop}>
            {t("collections-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources, () => refetch())}
          >
            {t("collections-save-and-go-back", "Save and go back")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            {t("collections-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddCollectionConditionsScreen
