import { useRef, useState } from "react"
import { useAdminSalesChannels } from "medusa-react"
import { SalesChannel } from "@medusajs/medusa"

import SideModal from "../../../components/molecules/modal/side-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import SalesChannelTable from "../tables/sales-channels-table"

const LIMIT = 12

const containsIdenticalKeys = (
  a: Record<string, any>,
  b: Record<string, any>
) => {
  a = Object.keys(a)
  b = Object.keys(b)
  return a.length === b.length && a.every((value) => b.includes(value))
}

type AddSalesChannelsSideModalProps = {
  close: () => void
  isVisible: boolean
  selectedChannels: Record<string, SalesChannel>
  setSelectedChannels: (arg: any) => void
}

/**
 * Modal for adding sales channels to a new PK during creation.
 */
function AddSalesChannelsSideModal(props: AddSalesChannelsSideModalProps) {
  const tableRef = useRef()
  const { isVisible, close, selectedChannels, setSelectedChannels } = props

  const [_selectedChannels, _setSelectedChannels] = useState<
    Record<number, SalesChannel>
  >({})

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true }
  )

  const onSave = () => {
    setSelectedChannels(_selectedChannels)
    setOffset(0)
    setSearch("")
    close()
  }

  const onClose = () => {
    setOffset(0)
    setSearch("")

    _setSelectedChannels(selectedChannels)

    Object.values(selectedChannels).map((channel) =>
      tableRef.current?.toggleRowSelected(channel.id, true)
    )

    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            Add sales channels
          </h3>
          <Button
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <div className="my-6">
            <InputField
              small
              name="name"
              type="string"
              value={search}
              className="h-[32px]"
              placeholder="Find channels"
              prefix={<SearchIcon size={16} />}
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>

          <SalesChannelTable
            ref={tableRef}
            query={search}
            data={data}
            offset={offset}
            count={count || 0}
            setOffset={setOffset}
            isLoading={isLoading}
            selectedChannels={_selectedChannels}
            setSelectedChannels={_setSelectedChannels}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="block h-[1px] bg-gray-200"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            disabled={containsIdenticalKeys(
              _selectedChannels,
              selectedChannels
            )}
          >
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default AddSalesChannelsSideModal
