import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

import {
  useAdminAddPublishableKeySalesChannelsBatch,
  useAdminRemovePublishableKeySalesChannelsBatch,
  useAdminPublishableApiKeySalesChannels,
  useAdminSalesChannels,
} from "medusa-react"

import Button from "../../../components/fundamentals/button"
import SideModal from "../../../components/molecules/modal/side-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import useNotification from "../../../hooks/use-notification"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import SalesChannelTable from "../tables/sales-channels-table"
import UTurnIcon from "../../../components/fundamentals/icons/u-turn-icon"

const LIMIT = 12

/* ****************************************** */
/* *************** ADD SCREEN *************** */
/* ****************************************** */

function AddScreen(props: {
  keyId: string
  close: () => void
  goBack: () => void
  isVisible: boolean
}) {
  const tableRef = useRef()

  const [selectedSalesChannels, setSelectedChannels] = useState({})
  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true, enabled: !!props.keyId }
  )

  const { mutateAsync: addSalesChannelsToKeyScope } =
    useAdminAddPublishableKeySalesChannelsBatch(props.keyId)

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
      setSelectedChannels({})
      tableRef.current?.toggleAllRowsSelected(false)
    }
  }, [props.isVisible])

  const onSave = (callback: () => void) => () => {
    addSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedSalesChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification("Success", "Sales channels added to the scope", "success")
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while adding sales channels to the scope of the key",
          "success"
        )
      })
      .finally(callback)
  }

  return (
    <div className="flex flex-col justify-between h-full p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          <Button
            variant="secondary"
            className="w-8 h-8 p-2 text-grey-50"
            onClick={props.goBack}
          >
            <UTurnIcon size={18} />
          </Button>
          Add sales channels
        </h3>
        <Button
          variant="secondary"
          className="w-8 h-8 p-2"
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
          selectedChannels={selectedSalesChannels}
          setSelectedChannels={setSelectedChannels}
        />
      </div>
      {/* === DIVIDER === */}

      <div
        className="h-[1px] bg-gray-200 block"
        style={{ margin: "24px -24px" }}
      />
      {/* === FOOTER === */}

      <div className="flex justify-end gap-2">
        <Button size="small" variant="ghost" onClick={props.close}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={onSave(props.goBack)}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Add and go back
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={onSave(props.close)}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Add and close
        </Button>
      </div>
    </div>
  )
}

/* ******************************************* */
/* *************** EDIT SCREEN *************** */
/* ******************************************* */

/**
 * Edit exiting PK SC list
 */
function EditScreen(props: {
  keyId: string
  close: () => void
  goAdd: () => void
  isVisible: boolean
}) {
  const { close } = props

  const tableRef = useRef()
  const [selectedChannels, setSelectedChannels] = useState({})

  const selectedCount = Object.keys(selectedChannels).length

  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const { sales_channels: data = [], isLoading } =
    useAdminPublishableApiKeySalesChannels(
      props.keyId,
      { q: search },
      {
        keepPreviousData: true,
        enabled: !!props.keyId,
      }
    )

  const { mutateAsync: removeSalesChannelsToKeyScope } =
    useAdminRemovePublishableKeySalesChannelsBatch(props.keyId)

  const onDeselect = () => {
    setSelectedChannels({})
    tableRef.current?.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    removeSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification(
          "Success",
          "Sales channels removed from the scope",
          "success"
        )
        setSelectedChannels({})
        tableRef.current?.toggleAllRowsSelected(false)
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while removing sales channels from the scope of the key",
          "success"
        )
      })
  }

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
      setSelectedChannels({})
      tableRef.current?.toggleAllRowsSelected(false)
    }
  }, [props.isVisible])

  // virtual pagination
  const displayData = useMemo(
    () => data?.slice(offset, offset + LIMIT),
    [data, offset]
  )

  return (
    <div className="flex flex-col justify-between h-full p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          Edit sales channels
        </h3>
        <Button
          variant="secondary"
          className="w-8 h-8 p-2"
          onClick={props.close}
        >
          <CrossIcon size={20} className="text-grey-50" />
        </Button>
      </div>
      {/* === DIVIDER === */}

      <div className="flex-grow">
        <div className="flex justify-between items-center gap-2 my-6">
          <InputField
            small
            name="name"
            type="string"
            value={search}
            className="h-[32px]"
            placeholder="Find channels"
            prefix={<SearchIcon size={14} />}
            onChange={(ev) => setSearch(ev.target.value)}
          />

          {selectedCount ? (
            <div className="flex gap-2 justify-between items-center h-[32px]">
              <span className="whitespace-nowrap text-small text-grey-50 px-2">
                {selectedCount} selected
              </span>
              <Button
                size="small"
                className="flex-shrink-0 h-[32px]"
                variant="secondary"
                onClick={onDeselect}
              >
                Deselect
              </Button>
              <Button
                size="small"
                className="flex-shrink-0 h-[32px] text-rose-500"
                variant="secondary"
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              size="small"
              className="flex-shrink-0 h-[32px]"
              variant="secondary"
              onClick={props.goAdd}
            >
              Add channels
            </Button>
          )}
        </div>

        <SalesChannelTable
          ref={tableRef}
          query={search}
          data={displayData}
          offset={offset}
          count={data.length || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
        />
      </div>
      {/* === DIVIDER === */}

      <div
        className="h-[1px] bg-gray-200 block"
        style={{ margin: "24px -24px" }}
      />
      {/* === FOOTER === */}

      <div className="flex justify-end gap-2">
        <Button size="small" variant="secondary" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  )
}

/* ***************************************************** */
/* *************** MANAGE CHANNELS MODAL *************** */
/* ***************************************************** */

type ManageSalesChannelsSideModalProps = {
  keyId?: string
  close: () => void
}

/**
 * Modal for adding/removing existing PKs channels.
 */
function ManageSalesChannelsSideModal(
  props: ManageSalesChannelsSideModalProps
) {
  const { keyId, close } = props

  const isVisible = !!keyId

  const [isAddNew, setIsAddNew] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setIsAddNew(false)
    }
  }, [isVisible])

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <motion.div
        style={{ width: 560 * 2, display: "flex", height: "100%" }}
        animate={{ x: isAddNew ? -560 : 0 }}
        transition={{ ease: "easeInOut" }}
      >
        {/* EDIT PANEL */}

        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: isAddNew ? 0 : 1 }}
        >
          <EditScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && !isAddNew}
            goAdd={() => setIsAddNew(true)}
          />
        </motion.div>
        {/* ADD PANEL */}

        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: !isAddNew ? 0 : 1 }}
        >
          <AddScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && isAddNew}
            goBack={() => setIsAddNew(false)}
          />
        </motion.div>
      </motion.div>
    </SideModal>
  )
}

export default ManageSalesChannelsSideModal
