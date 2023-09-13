import { Discount } from "@medusajs/medusa"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../../components/fundamentals/icons/plus-icon"
import AddConditionsModal from "../../add-conditions-modal"
import { useDiscountForm } from "../../form/discount-form-context"
import ConditionItem from "./condition-item"

type DiscountNewConditionsProps = {
  discount?: Discount
}

const DiscountNewConditions: React.FC<DiscountNewConditionsProps> = ({
  discount,
}) => {
  const { t } = useTranslation()
  const { setConditions, conditions } = useDiscountForm()
  const [showConditionsModal, setShowConditionsModal] = useState(false)

  useEffect(() => {
    if (discount?.rule?.conditions) {
      for (const condtion of discount.rule.conditions) {
        setConditions((prevCond) => ({
          ...prevCond,
          [condtion.type]: {
            ...conditions[condtion.type],
            id: condtion.id,
            operator: condtion.operator,
            type: condtion.type,
          },
        }))
      }
    }
  }, [discount?.rule?.conditions])

  const allSet = useMemo(() => {
    const allSet = Object.values(conditions).every((condition) => {
      return condition.items.length
    })
    return allSet
  }, [conditions])

  const filteredConditions = useMemo(() => {
    return Object.values(conditions).filter((condition) => {
      return condition.id || condition.items.length
    })
  }, [conditions])

  return (
    <div className="pt-5">
      <div className="gap-y-small flex flex-col">
        {filteredConditions.map((values, i) => (
          <ConditionItem
            index={i}
            key={i}
            discountId={discount?.id}
            conditionId={values.id}
            type={values.type}
            setCondition={setConditions}
            items={values.items}
          />
        ))}
      </div>
      {!allSet && (
        <Button
          size="small"
          variant="ghost"
          onClick={() => setShowConditionsModal(true)}
          className="rounded-rounded mt-4 w-full border p-2"
        >
          <PlusIcon size={18} />
          <span>{t("conditions-add-condition", "Add Condition")}</span>
        </Button>
      )}
      {showConditionsModal && (
        <AddConditionsModal
          onClose={() => setShowConditionsModal(false)}
          conditions={conditions}
        />
      )}
    </div>
  )
}

export default DiscountNewConditions
