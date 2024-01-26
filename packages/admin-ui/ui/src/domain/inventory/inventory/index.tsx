import Spacer from "../../../components/atoms/spacer"
import BodyCard from "../../../components/organisms/body-card"
import InventoryTable from "../../../components/templates/inventory-table"
import InventoryPageTableHeader from "../header"

const InventoryView = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={<InventoryPageTableHeader activeView="inventory" />}
          className="h-fit"
        >
          <InventoryTable />
        </BodyCard>
        <Spacer />
      </div>
    </div>
  )
}

export default InventoryView
