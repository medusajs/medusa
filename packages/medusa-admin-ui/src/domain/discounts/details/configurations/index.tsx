import { Discount } from "@medusajs/medusa"
import React, { useState } from "react"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import NumberedItem from "../../../../components/molecules/numbered-item"
import BodyCard from "../../../../components/organisms/body-card"
import EditConfigurations from "./edit-configurations"
import useDiscountConfigurations from "./use-discount-configurations"

type ConfigurationsProps = {
  discount: Discount
}

const Configurations: React.FC<ConfigurationsProps> = ({ discount }) => {
  const configurations = useDiscountConfigurations(discount)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <BodyCard
        title={"Configurations"}
        className="min-h-[200px]"
        actionables={[
          {
            label: "Edit configurations",
            onClick: () => setShowModal(true),
            icon: <EditIcon size={20} />,
          },
        ]}
        forceDropdown
      >
        <div
          style={{
            gridTemplateRows: `repeat(${Math.ceil(
              configurations.length / 2
            )}, minmax(0, 1fr))`,
          }}
          className="grid grid-cols-2 grid-flow-col gap-y-base gap-x-xlarge"
        >
          {configurations.map((setting, i) => (
            <NumberedItem
              key={i}
              title={setting.title}
              index={i + 1}
              description={setting.description}
              actions={setting.actions}
            />
          ))}
        </div>
      </BodyCard>
      {showModal && (
        <EditConfigurations
          discount={discount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default Configurations
