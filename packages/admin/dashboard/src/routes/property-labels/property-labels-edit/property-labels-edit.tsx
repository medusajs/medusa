import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useEntityColumns } from "../../../hooks/api/views"
import { usePropertyLabels } from "../../../hooks/api/property-labels"
import { PropertyLabelsEditForm } from "../components/property-labels-edit-form"

export const PropertyLabelsEdit = () => {
  const { entity } = useParams()

  const {
    columns,
    isLoading: isLoadingColumns,
    isError: isColumnsError,
    error: columnsError,
  } = useEntityColumns(entity!)

  const {
    property_labels,
    isLoading: isLoadingLabels,
    isError: isLabelsError,
    error: labelsError,
  } = usePropertyLabels({
    entity: entity!,
  })

  if (isColumnsError) {
    throw columnsError
  }

  if (isLabelsError) {
    throw labelsError
  }

  const isLoading = isLoadingColumns || isLoadingLabels

  return (
    <RouteFocusModal>
      {!isLoading && columns && property_labels && (
        <PropertyLabelsEditForm
          entity={entity!}
          columns={columns}
          propertyLabels={property_labels}
        />
      )}
    </RouteFocusModal>
  )
}
