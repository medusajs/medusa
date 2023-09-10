import clsx from "clsx"
import { useEffect, useMemo, useRef, useState } from "react"

import { SalesChannel } from "@medusajs/medusa"
import {
  useAdminDeleteSalesChannel,
  useAdminSalesChannels,
  useAdminStore,
  useAdminUpdateSalesChannel,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Fade from "../../../components/atoms/fade-wrapper"
import Spacer from "../../../components/atoms/spacer"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"
import StatusSelector from "../../../components/molecules/status-selector"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useToggleState from "../../../hooks/use-toggle-state"
import AddSalesChannelModal from "../form/add-sales-channel"
import EditSalesChannel from "../form/edit-sales-channel"
import {
  SalesChannelProductsSelectModal,
  SalesChannelProductsTable,
} from "../tables/product"

type ListIndicatorProps = { isActive: boolean }

/**
 * Sales channels list indicator component.
 */
function ListIndicator(props: ListIndicatorProps) {
  const { isActive } = props
  return (
    <div
      className={clsx(
        "rounded-circle flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center border bg-white",
        {
          "border-violet-60 border-2": isActive,
        }
      )}
    >
      {isActive && (
        <div className="bg-violet-60 rounded-circle h-[10px] w-[10px]" />
      )}
    </div>
  )
}

/**
 * List indicator for disabled SC.
 */
function DisabledLabel() {
  const { t } = useTranslation()
  return (
    <div
      className="
      bg-grey-10 text-grey-50
      text-small
      flex
      h-[28px] w-[54px] items-center
      justify-center rounded-xl font-semibold"
    >
      {t("pages-draft", "Draft")}
    </div>
  )
}

type SalesChannelTileProps = {
  salesChannel: SalesChannel
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

/**
 * Sales channels list tile component.
 */
function SalesChannelTile(props: SalesChannelTileProps) {
  const { salesChannel, isSelected, onClick, isDisabled } = props

  return (
    <div
      onClick={onClick}
      className={clsx(
        "mb-2 flex h-[83px] cursor-pointer justify-between rounded-lg border p-4",
        {
          "border-violet-60 border-2": isSelected,
        }
      )}
    >
      <div className="flex gap-2 overflow-hidden">
        <ListIndicator isActive={isSelected} />
        <div className="block overflow-hidden truncate">
          <h3 className="text-grey-90 mb-1 font-semibold leading-5">
            {salesChannel.name}
          </h3>
          <span className="text-small text-grey-50 ">
            {salesChannel.description}
          </span>
        </div>
      </div>
      {isDisabled && (
        <div className="flex flex-shrink-0 flex-col justify-center">
          <DisabledLabel />
        </div>
      )}
    </div>
  )
}

type SalesChannelsHeaderProps = {
  openCreateModal: () => void
  filterText?: string
  setFilterText: (text: string) => void
}

/**
 * Sales channel header.
 */
function SalesChannelsHeader(props: SalesChannelsHeaderProps) {
  const { openCreateModal, filterText, setFilterText } = props
  const [showFilter, setShowFilter] = useState(false)

  const inputRef = useRef()
  const { t } = useTranslation()

  const classes = {
    "translate-y-[-50px]": showFilter,
    "translate-y-[0px]": !showFilter,
  }

  const hideFilter = () => {
    setShowFilter(false)
    setFilterText("")
  }

  return (
    <div className="mb-6 h-[55px] overflow-hidden">
      <div className={clsx("transition-all duration-200", classes)}>
        <div className="h-[55px]">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xlarge text-grey-90 font-semibold">
              {t("pages-sales-channels", "Sales channels")}
            </h2>
            <div className="flex items-center justify-between gap-4">
              <SearchIcon
                size={15}
                onClick={() => setShowFilter(true)}
                className="cursor-pointer"
              />
              <PlusIcon
                size={15}
                onClick={openCreateModal}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="text-grey-50 text-small mb-6 block max-w-[100%] overflow-hidden truncate">
            {t(
              "pages-control-which-products-are-available-in-which-channels",
              "Control which products are available in which channels"
            )}
          </div>
        </div>

        <div className="text-grey-40 bg-grey-5 my-[5px] flex h-[40px] w-full items-center justify-around gap-2 rounded-xl border px-4">
          <SearchIcon size={20} />
          <input
            ref={inputRef}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={t(
              "pages-search-by-title-or-description",
              "Search by title or description"
            )}
            className="remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full bg-inherit font-normal outline-none outline-0"
            onBlur={() => setShowFilter(!!filterText)}
            autoComplete="off"
          />
          <CrossIcon onClick={hideFilter} className="cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

type SalesChannelsListProps = {
  activeChannelId: string
  openCreateModal: () => void
  filterText?: string
  setFilterText: (text: string) => void
  salesChannels: SalesChannel[]
  setActiveSalesChannelId: (salesChannelId: string) => void
}

/**
 * Sales channels list.
 */
function SalesChannelsList(props: SalesChannelsListProps) {
  const {
    activeChannelId,
    openCreateModal,
    setActiveSalesChannelId,
    salesChannels,
    filterText,
    setFilterText,
  } = props

  return (
    <div className="bg-grey-0 border-grey-20  col-span-1 grow rounded-lg border px-8 py-6">
      <SalesChannelsHeader
        filterText={filterText}
        setFilterText={setFilterText}
        openCreateModal={openCreateModal}
      />
      <div>
        {salesChannels?.map((s) => (
          <SalesChannelTile
            salesChannel={s}
            isDisabled={s.is_disabled}
            isSelected={activeChannelId === s.id}
            onClick={() => setActiveSalesChannelId(s.id)}
          />
        ))}
      </div>
    </div>
  )
}

type SalesChannelDetailsHeaderProps = {
  salesChannel: SalesChannel
  openUpdateModal: () => void
  resetDetails: () => void
  showProductsAdd: () => void
  isDefault: boolean
}

/**
 * Sales channels details header.
 */
function SalesChannelDetailsHeader(props: SalesChannelDetailsHeaderProps) {
  const {
    isDefault,
    salesChannel,
    openUpdateModal,
    resetDetails,
    showProductsAdd,
  } = props
  const { t } = useTranslation()

  const { mutate: deleteSalesChannel } = useAdminDeleteSalesChannel(
    salesChannel.id
  )

  const { mutate: updateSalesChannel } = useAdminUpdateSalesChannel(
    salesChannel.id
  )

  const confirmation = useImperativeDialog()

  const onDelete = async () => {
    const confirmed = await confirmation({
      text: t(
        "pages-confirm-delete-sales-channel",
        "Are you sure you want to delete this sales channel? The setup you made will be gone forever."
      ),
      heading: t("pages-delete-channel-heading", "Delete Channel"),
      extraConfirmation: true,
      entityName: salesChannel.name,
    })

    if (confirmed) {
      deleteSalesChannel()
      resetDetails()
    }
  }

  const actions = useMemo(() => {
    const _actions: ActionType[] = [
      {
        label: t("pages-edit-general-info", "Edit general info"),
        icon: <EditIcon size="20" />,
        onClick: openUpdateModal,
      },
      {
        label: t("pages-add-products", "Add products"),
        icon: <PlusIcon />,
        onClick: () => showProductsAdd(),
      },
    ]

    if (!isDefault) {
      _actions.push({
        label: t("pages-delete-channel", "Delete channel"),
        icon: <TrashIcon size={20} />,
        variant: "danger",
        onClick: onDelete,
      })
    }

    return _actions
  }, [openUpdateModal])

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xlarge text-grey-90 mb-4 font-semibold">
        {salesChannel.name}
      </h2>
      <div className="flex items-center justify-between gap-4">
        <StatusSelector
          onChange={() =>
            updateSalesChannel({ is_disabled: !salesChannel.is_disabled })
          }
          isDraft={salesChannel.is_disabled}
          draftState={t("pages-disabled", "Disabled")}
          activeState={t("pages-enabled", "Enabled")}
        />
        <Actionables forceDropdown={true} actions={actions} />
      </div>
    </div>
  )
}

type SalesChannelDetailsProps = {
  salesChannel: SalesChannel
  resetDetails: () => void
  isDefault: boolean
}

/**
 * Sales channels details container.
 */
function SalesChannelDetails(props: SalesChannelDetailsProps) {
  const { resetDetails, salesChannel, isDefault } = props

  const [showUpdateModal, openUpdateModal, closeUpdateModal] =
    useToggleState(false)
  const [showAddProducts, showProductsAdd, hideProductsAdd] =
    useToggleState(false)

  return (
    <div className="rounded-rounded bg-grey-0 border-grey-20 col-span-2 col-span-2 h-fit border px-8 py-6">
      <SalesChannelDetailsHeader
        isDefault={isDefault}
        resetDetails={resetDetails}
        salesChannel={salesChannel}
        openUpdateModal={openUpdateModal}
        showProductsAdd={showProductsAdd}
      />

      <SalesChannelProductsTable
        salesChannelId={salesChannel.id}
        showAddModal={showProductsAdd}
      />

      {showUpdateModal && (
        <EditSalesChannel
          handleClose={closeUpdateModal}
          salesChannel={salesChannel}
        />
      )}

      {showAddProducts && (
        <SalesChannelProductsSelectModal
          salesChannel={salesChannel}
          handleClose={hideProductsAdd}
        />
      )}
    </div>
  )
}

/**
 * Sales channels details page container.
 */
function Details() {
  const { id: routeSalesChannelId } = useParams()
  const { t } = useTranslation()

  const [filterText, setFilterText] = useState<string>()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [activeSalesChannel, setActiveSalesChannel] =
    useState<SalesChannel | null>()

  const navigate = useNavigate()
  const { store } = useAdminStore()
  const { sales_channels } = useAdminSalesChannels()

  const setActiveSalesChannelId = (scId: string) => {
    navigate(`/a/sales-channels/${scId}`)
  }

  useEffect(() => {
    if (sales_channels && store) {
      if (!activeSalesChannel) {
        setActiveSalesChannelId(store.default_sales_channel_id)
      } else {
        setActiveSalesChannelId(activeSalesChannel.id)
      }
    }
  }, [sales_channels, store, activeSalesChannel?.id])

  useEffect(() => {
    if (routeSalesChannelId !== activeSalesChannel?.id) {
      const activeChannel = sales_channels?.find(
        (sc) => sc.id === routeSalesChannelId
      )
      setActiveSalesChannel(activeChannel)
    }
  }, [routeSalesChannelId, activeSalesChannel, sales_channels])

  const openCreateModal = () => setShowCreateModal(true)
  const closeCreateModal = (scId: string) => {
    setActiveSalesChannelId(scId)
    setShowCreateModal(false)
  }

  const resetDetails = () => {
    setActiveSalesChannelId(store!.default_sales_channel_id)
  }

  function defaultChannelsSorter(sc1, sc2) {
    if (sc1.id === store?.default_sales_channel_id) {
      return -1
    }
    if (sc2.id === store?.default_sales_channel_id) {
      return 1
    }

    return sc1.name.localeCompare(sc2.name)
  }

  function filterSalesChannels(channels: SalesChannel[]) {
    if (!filterText) {
      return channels
    }

    return channels.filter((ch) => {
      const filter = filterText.toLowerCase()
      return (
        !!ch.name.toLowerCase().match(filter) ||
        !!ch.description?.toLowerCase().match(filter)
      )
    })
  }

  if (!sales_channels || !activeSalesChannel) {
    return null
  }

  return (
    <div>
      <BackButton
        path="/a/settings"
        label={t("pages-back-to-settings", "Back to settings")}
        className="mb-xsmall"
      />

      <div className="gap-x-xsmall grid grid-cols-3">
        <SalesChannelsList
          filterText={filterText}
          setFilterText={setFilterText}
          openCreateModal={openCreateModal}
          activeChannelId={activeSalesChannel.id}
          setActiveSalesChannelId={setActiveSalesChannelId}
          salesChannels={filterSalesChannels(sales_channels).sort(
            defaultChannelsSorter
          )}
        />
        {activeSalesChannel && (
          <SalesChannelDetails
            isDefault={
              activeSalesChannel.id === store?.default_sales_channel_id
            }
            salesChannel={
              sales_channels.find((sc) => sc.id === activeSalesChannel.id)!
            }
            resetDetails={resetDetails}
          />
        )}
      </div>
      <Spacer />

      <Fade isVisible={showCreateModal} isFullScreen={true}>
        <AddSalesChannelModal onClose={closeCreateModal} />
      </Fade>
    </div>
  )
}

export default Details
