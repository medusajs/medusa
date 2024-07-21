import { useAdminProductTags } from "medusa-react"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../../../components/fundamentals/button"
import Modal from "../../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TagColumns,
  TagHeader,
  TagRow,
} from "../../../../../new/discount-form/condition-tables/shared/tags"
import { useEditConditionContext } from "../../edit-condition-provider"

const AddTagsConditionsScreen = () => {
  const { t } = useTranslation()
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const { isLoading, count, product_tags } = useAdminProductTags(
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
            searchPlaceholder: t("tags-search", "Search..."),
          }}
          resourceName="Tags"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={product_tags || []}
          columns={TagColumns}
          isLoading={isLoading}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={TagRow}
          renderHeaderGroup={TagHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button variant="secondary" size="small" onClick={pop}>
            {t("tags-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources)}
          >
            {t("tags-save-and-go-back", "Save and go back")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            {t("tags-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddTagsConditionsScreen
