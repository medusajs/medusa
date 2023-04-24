import React, { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Fade from "../../components/atoms/fade-wrapper"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import DiscountTable from "../../components/templates/discount-table"
import Details from "./details"
import New from "./new"
import DiscountForm from "./new/discount-form"
import { DiscountFormProvider } from "./new/discount-form/form/discount-form-context"

const DiscountIndex = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actionables = [
    {
      label: "Add Discount",
      onClick: () => setIsOpen(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["discounts"]} />}
          className="h-fit"
        >
          <DiscountTable />
        </BodyCard>
      </div>
      <DiscountFormProvider>
        <Fade isVisible={isOpen} isFullScreen={true}>
          <DiscountForm closeForm={() => setIsOpen(false)} />
        </Fade>
      </DiscountFormProvider>
    </div>
  )
}

const Discounts = () => {
  return (
    <Routes>
      <Route index element={<DiscountIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default Discounts
