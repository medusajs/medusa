import BodyCard from "../../../components/organisms/body-card"
import InventoryTable from "../../../components/templates/inventory-table"
import InventoryPageTableHeader from "../header"

const InventoryView = () => {
  return (
    <div className="flex flex-col h-full grow">
      <div className="flex flex-col w-full grow">
        <BodyCard
          customHeader={<InventoryPageTableHeader activeView="inventory" />}
          className="h-fit"
        >
          <InventoryTable />
        </BodyCard>
      </div>
    </div>
  )
}

export default InventoryView
