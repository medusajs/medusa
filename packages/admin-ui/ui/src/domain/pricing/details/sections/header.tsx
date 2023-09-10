import { useAdminDeletePriceList } from "medusa-react"
import moment from "moment"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Fade from "../../../../components/atoms/fade-wrapper"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import BodyCard from "../../../../components/organisms/body-card"
import {
  formatPriceListGroups,
  getPriceListStatus,
} from "../../../../components/templates/price-list-table/utils"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import PriceListForm from "../../pricing-form"
import { ViewType } from "../../pricing-form/types"

const Header = ({ priceList }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <HeadingBodyCard priceList={priceList} setIsOpen={setIsOpen}>
      <div className="flex gap-12">
        {priceList.customer_groups.length ? (
          <div className="border-grey-20 border-l pl-6">
            <span className="inter-base-regular text-grey-50">
              {t("sections-customer-groups", "Customer groups")}
            </span>
            <p className="inter-base-regular text-grey-90">
              <PriceListCustomerGroupsFormatter
                groups={priceList.customer_groups}
              />
            </p>
          </div>
        ) : null}
        <div className="border-grey-20 border-l pl-6">
          <span className="inter-base-regular text-grey-50">
            {t("sections-last-edited", "Last edited")}
          </span>
          <p className="inter-base-regular text-grey-90">
            {moment(priceList.updated_at).format("ddd, D MMM YYYY")}
          </p>
        </div>
        <div className="border-grey-20 border-l pl-6">
          <span className="inter-base-regular text-grey-50">
            {t("sections-price-overrides", "Price overrides")}
          </span>
          <p className="inter-base-regular text-grey-90">
            {priceList.prices?.length}
          </p>
        </div>
      </div>
      {isOpen && (
        <Fade isVisible={isOpen} isFullScreen={true}>
          <PriceListForm
            id={priceList.id}
            onClose={() => setIsOpen(false)}
            viewType={ViewType.EDIT_DETAILS}
          />
        </Fade>
      )}
    </HeadingBodyCard>
  )
}

const PriceListCustomerGroupsFormatter = ({ groups }) => {
  const { t } = useTranslation()
  const [group, other] = formatPriceListGroups(groups.map((cg) => cg.name))
  return (
    <>
      {group}
      {other && (
        <span className="text-grey-40">
          {" "}
          + {other} {t("sections-more", "more")}
        </span>
      )}
    </>
  )
}

const HeadingBodyCard = ({ priceList, setIsOpen, ...props }) => {
  const { t } = useTranslation()
  const dialog = useImperativeDialog()
  const navigate = useNavigate()
  const notification = useNotification()
  const deletePriceList = useAdminDeletePriceList(priceList?.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("sections-delete-price-list-heading", "Delete Price list"),
      text: t(
        "sections-are-you-sure-you-want-to-delete-this-price-list",
        "Are you sure you want to delete this price list?"
      ),
    })
    if (shouldDelete) {
      deletePriceList.mutate(undefined, {
        onSuccess: () => {
          notification(
            t("sections-success", "Success"),
            t(
              "sections-price-list-deleted-successfully",
              "Price list deleted successfully"
            ),
            "success"
          )
          navigate("/a/pricing/")
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      })
    }
  }

  const actionables = [
    {
      label: t("sections-edit-price-list-details", "Edit price list details"),
      onClick: () => setIsOpen(true),
      icon: <EditIcon size={20} />,
    },
    {
      label: t("sections-delete-price-list", "Delete price list"),
      onClick: onDelete,
      variant: "danger" as const,
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <BodyCard
      actionables={actionables}
      forceDropdown
      className="min-h-[200px]"
      status={
        <div className="gap-x-2xsmall flex items-center">
          {getPriceListStatus(priceList)}
        </div>
      }
      title={priceList.name}
      subtitle={priceList.description}
      {...props}
    />
  )
}

export default Header
