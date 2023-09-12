import { useTranslation } from "react-i18next"
import Actionables from "../../../components/molecules/actionables"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Badge from "../../../components/fundamentals/badge"

export const TaxRuleItem = ({ onEdit, onDelete, index, name, description }) => {
  const { t } = useTranslation()
  return (
    <div className="p-base rounded-rounded gap-base flex items-center border">
      <div>
        <Badge
          className="inter-base-semibold flex h-[40px] w-[40px] items-center justify-center"
          variant="default"
        >
          §{index}
        </Badge>
      </div>
      <div className="flex-1">
        <div className="inter-small-semibold">{name}</div>
        <div className="inter-small-regular text-grey-50">{description}</div>
      </div>
      <div>
        <Actionables
          forceDropdown
          actions={[
            {
              label: t("taxes-edit", "Edit"),
              onClick: () => onEdit(),
              icon: <EditIcon size={20} />,
            },
            {
              label: t("taxes-delete-rule", "Delete rule"),
              variant: "danger",
              onClick: () => onDelete(),
              icon: <TrashIcon size={20} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
