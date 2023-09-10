import { StockLocationDTO } from "@medusajs/types"
import { useAdminDeleteStockLocation } from "medusa-react"
import React from "react"
import { useTranslation } from "react-i18next"
import IconBadge from "../../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../../components/fundamentals/icons/buildings-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables, {
  ActionType,
} from "../../../../../components/molecules/actionables"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { countryLookup } from "../../../../../utils/countries"
import { getErrorMessage } from "../../../../../utils/error-messages"
import LocationEditModal from "../../edit"
import SalesChannelsSection from "../sales-channels-section"

type Props = {
  location: StockLocationDTO
}

const LocationCard: React.FC<Props> = ({ location }) => {
  const { t } = useTranslation()
  const { mutate: deleteLocation } = useAdminDeleteStockLocation(location.id)

  const dialog = useImperativeDialog()
  const notification = useNotification()
  const { isFeatureEnabled } = useFeatureFlag()

  const {
    state: editLocationState,
    close: closeLocationEdit,
    open: openLocationEdit,
  } = useToggleState()

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("location-card-delete-location", "Delete Location"),
      text: t(
        "location-card-confirm-delete",
        "Are you sure you want to delete this location. This will also delete all inventory levels and reservations associated with this location."
      ),
      extraConfirmation: true,
      entityName: location.name,
    })
    if (shouldDelete) {
      deleteLocation(undefined, {
        onSuccess: () => {
          notification(
            t("location-card-success", "Success"),
            t(
              "location-card-location-deleted-successfully",
              "Location deleted successfully"
            ),
            "success"
          )
        },
        onError: (err) => {
          notification(
            t("location-card-error", "Error"),
            getErrorMessage(err),
            "error"
          )
        },
      })
    }
  }

  const DropdownActions: ActionType[] = [
    {
      label: t("location-card-edit-details", "Edit details"),
      onClick: openLocationEdit,
      variant: "normal",
      icon: <EditIcon size="20px" />,
    },
    {
      label: t("location-card-delete", "Delete"),
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size="20px" />,
    },
  ]

  return (
    <div className="my-base rounded-rounded bg-grey-0 border-grey-20 border">
      <div className="py-base flex items-center px-6">
        <IconBadge>
          <BuildingsIcon />
        </IconBadge>
        <div className="ml-base flex flex-col">
          <span className="text-grey-90 font-semibold">{location.name}</span>
          {location.address && (
            <div>
              {location.address.city && <span>{location.address.city}, </span>}
              <span>{countryLookup(location.address.country_code)}</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <Actionables actions={DropdownActions} forceDropdown={true} />
        </div>
      </div>
      {isFeatureEnabled("sales_channels") && (
        <div className="py-base border-grey-20 border-t border-solid px-6">
          <h2 className="inter-small-semibold text-gray-500">
            {t(
              "location-card-connected-sales-channels",
              "Connected sales channels"
            )}
          </h2>
          <SalesChannelsSection location={location} />
        </div>
      )}
      {editLocationState && (
        <LocationEditModal onClose={closeLocationEdit} location={location} />
      )}
    </div>
  )
}

export default LocationCard
