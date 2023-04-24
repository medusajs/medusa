import { useAdminCreateBatchJob, useAdminCreateCollection } from "medusa-react"
import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import ExportIcon from "../../../components/fundamentals/icons/export-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import UploadIcon from "../../../components/fundamentals/icons/upload-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import ExportModal from "../../../components/organisms/export-modal"
import AddCollectionModal from "../../../components/templates/collection-modal"
import CollectionsTable from "../../../components/templates/collections-table"
import ProductTable from "../../../components/templates/product-table"
import useNotification from "../../../hooks/use-notification"
import { useUserPermissions } from "../../../hooks/use-permissions"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import { useBasePath } from "../../../utils/routePathing"
import ImportProducts from "../batch-job/import"
import { BulkUpdateProductsModal } from "../components/bulk-update-modal"
import NewProduct from "../new"
import { PollingContext } from "../../../context/polling"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import { useSelectedVendor } from "../../../context/vendor"
import ImportEtsyProducts from "../batch-job/etsy-import"
import ProductImportButton from "../../../components/molecules/product-import-button"

const AdminViews = ["products", "collections"]
const VendorViews = ["products"]

const Overview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isVendorRoute = location.pathname.includes("vendor")
  const basePath = useBasePath()
  const permissions = useUserPermissions()
  const { isStoreView, isPrimary } = useSelectedVendor()

  const searchParams = new URLSearchParams(location.search)
  const [view, setView] = useState(
    searchParams.get("view") === "collections" && !isVendorRoute
      ? "collections"
      : "products"
  )
  const {
    state: createProductState,
    close: closeProductCreate,
    open: openProductCreate,
  } = useToggleState()

  const { resetInterval } = useContext(PollingContext)

  const createBatchJob = useAdminCreateBatchJob()

  const notification = useNotification()

  const createCollection = useAdminCreateCollection()

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const CurrentView = () => {
    switch (view) {
      case "products":
        return (
          <ProductTable
            selectedIds={selectedIds}
            updateSelectedIds={(ids) => setSelectedIds(ids)}
          />
        )
      default:
        return <CollectionsTable />
    }
  }

  const CurrentAction = () => {
    switch (view) {
      case "products":
        return (
          <div className="flex space-x-2">
            {selectedIds.length > 0 && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => openBulkUpdateModal()}
              >
                <EditIcon size={20} />
                Bulk Edit
              </Button>
            )}
            <ProductImportButton
              openModal={(type) => {
                setImportModalType(type)
              }}
            />
            <Button
              variant="secondary"
              size="small"
              onClick={() => openExportModal()}
            >
              <ExportIcon size={20} />
              Export Products
            </Button>
            {isVendorRoute && (
              <Button
                variant="secondary"
                size="small"
                onClick={openProductCreate}
              >
                <PlusIcon size={20} />
                New Product
              </Button>
            )}
          </div>
        )
      default:
        return (
          <div className="flex space-x-2">
            {permissions.productCollection.create &&
              (isStoreView || isPrimary) && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowNewCollection(!showNewCollection)}
                >
                  <PlusIcon size={20} />
                  New Collection
                </Button>
              )}
          </div>
        )
    }
  }

  const [showNewCollection, setShowNewCollection] = useState(false)

  const {
    open: openBulkUpdateModal,
    close: closeBulkUpdateModal,
    state: bulkUpdateModalOpen,
  } = useToggleState(false)

  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const [importModalType, setImportModalType] = useState<"etsy" | "csv" | null>(
    null
  )

  const handleCreateCollection = async (data, colMetadata) => {
    const metadata = colMetadata
      .filter((m) => m.key && m.value) // remove empty metadata
      .reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})

    await createCollection.mutateAsync(
      { ...data, metadata },
      {
        onSuccess: ({ collection }) => {
          notification("Success", "Successfully created collection", "success")
          navigate(`${basePath}/collections/${collection.id}`)
          setShowNewCollection(false)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  const handleCreateExport = () => {
    const reqObj = {
      type: "product-export",
      context: {},
      dry_run: false,
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        resetInterval()
        notification("Success", "Successfully initiated export", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })

    closeExportModal()
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            forceDropdown={false}
            customActionable={<CurrentAction />}
            customHeader={
              <TableViewHeader
                views={permissions.isAdmin ? AdminViews : VendorViews}
                setActiveView={setView}
                activeView={view}
              />
            }
            className="h-fit"
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
      {showNewCollection && (
        <AddCollectionModal
          onClose={() => setShowNewCollection(!showNewCollection)}
          onSubmit={handleCreateCollection}
        />
      )}
      {exportModalOpen && (
        <ExportModal
          title="Export Products"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
      {bulkUpdateModalOpen && (
        <BulkUpdateProductsModal
          selectedProductIds={selectedIds}
          close={() => closeBulkUpdateModal()}
          onSave={() => setSelectedIds([])}
        />
      )}
      {importModalType === "etsy" && (
        <ImportEtsyProducts handleClose={() => setImportModalType(null)} />
      )}

      {importModalType === "csv" && (
        <ImportProducts handleClose={() => setImportModalType(null)} />
      )}

      <Fade isVisible={createProductState} isFullScreen={true}>
        <NewProduct onClose={closeProductCreate} />
      </Fade>
    </>
  )
}

export default Overview
