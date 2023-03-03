import { Discount } from "@medusajs/medusa"
import React, { useState } from "react"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import NumberedItem from "../../../../components/molecules/numbered-item"
import BodyCard from "../../../../components/organisms/body-card"
import AddCondition from "./add-condition"
import { ConditionsProvider } from "./add-condition/conditions-provider"
import EditConditionsModal from "./edit-condition/edit-condition-modal"
import { useDiscountConditions } from "./use-discount-conditions"

type DiscountDetailsConditionsProps = {
  discount: Discount
}

const DiscountDetailsConditions: React.FC<DiscountDetailsConditionsProps> = ({
  discount,
}) => {
  const [show, setShow] = useState(false)

  const {
    conditions,
    selectedCondition,
    deSelectCondition,
  } = useDiscountConditions(discount)

  return (
    <ConditionsProvider discount={discount}>
      <BodyCard
        title="Conditions"
        className="min-h-[200px]"
        forceDropdown
        actionables={[
          {
            label: "Add condition",
            icon: <PlusIcon size={16} />,
            onClick: () => setShow(true),
          },
        ]}
      >
        {conditions.length ? (
          <div
            style={{
              gridTemplateRows: `repeat(${Math.ceil(
                conditions?.length / 2
              )}, minmax(0, 1fr))`,
            }}
            className="grid grid-cols-2 grid-flow-col gap-y-base gap-x-xlarge"
          >
            {conditions.map((condition, i) => (
              <NumberedItem
                key={i}
                title={condition.title}
                index={i + 1}
                description={condition.description}
                actions={condition.actions}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center flex-1 gap-y-small">
            <span className="inter-base-regular text-grey-50">
              This discount has no conditions
            </span>
          </div>
        )}
      </BodyCard>
      <AddCondition show={show} onClose={() => setShow(false)} />
      {selectedCondition && (
        <EditConditionsModal
          open={!!selectedCondition}
          condition={selectedCondition}
          discount={discount}
          onClose={() => deSelectCondition()}
        />
      )}
    </ConditionsProvider>
  )
}

export default DiscountDetailsConditions
