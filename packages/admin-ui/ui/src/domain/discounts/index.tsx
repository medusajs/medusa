import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Fade from "../../components/atoms/fade-wrapper"
import Spacer from "../../components/atoms/spacer"
import RouteContainer from "../../components/extensions/route-container"
import WidgetContainer from "../../components/extensions/widget-container"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import DiscountTable from "../../components/templates/discount-table"
import { useRoutes } from "../../providers/route-provider"
import { useWidgets } from "../../providers/widget-provider"
import Details from "./details"
import New from "./new"
import DiscountForm from "./new/discount-form"
import { DiscountFormProvider } from "./new/discount-form/form/discount-form-context"

const DiscountIndex = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const actionables = [
    {
      label: t("discounts-add-discount", "Add Discount"),
      onClick: () => setIsOpen(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  const { getWidgets } = useWidgets()

  return (
    <div className="flex h-full flex-col">
      <div className="gap-y-xsmall flex w-full grow flex-col">
        {getWidgets("discount.list.before").map((w, index) => {
          return (
            <WidgetContainer
              key={index}
              widget={w}
              injectionZone="discount.list.before"
              entity={null}
            />
          )
        })}
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["discounts"]} />}
          className="h-fit"
        >
          <DiscountTable />
        </BodyCard>
        {getWidgets("discount.list.after").map((w, index) => {
          return (
            <WidgetContainer
              key={index}
              widget={w}
              injectionZone="discount.list.after"
              entity={null}
            />
          )
        })}
        <Spacer />
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
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/discounts")

  return (
    <Routes>
      <Route index element={<DiscountIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<Details />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/discounts"} />}
          />
        )
      })}
    </Routes>
  )
}

export default Discounts
