import BodyCard from "../../../components/organisms/body-card"
import InventoryPageTableHeader from "../header"

const InventoryView = () => {
  return (
    <div className="flex flex-col h-full grow">
      <div className="flex flex-col w-full grow">
        <BodyCard
          customHeader={<InventoryPageTableHeader activeView="inventory" />}
          className="h-fit"
        >
          <h1>Inventory</h1>
        </BodyCard>
      </div>
    </div>
  )
}

export default InventoryView
