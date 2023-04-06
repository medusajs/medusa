import { useAdminCreateBatchJob, useAdminCreateCollection } from "medusa-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Fade from "../../../components/atoms/fade-wrapper"
import Spacer from "../../../components/atoms/spacer"
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
import useToggleState from "../../../hooks/use-toggle-state"
import { usePolling } from "../../../providers/polling-provider"
import { getErrorMessage } from "../../../utils/error-messages"
import ImportProducts from "../batch-job/import"
import NewProduct from "../new"

const VIEWS = ["products", "collections"]

const Overview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState("products")
  const {
    state: createProductState,
    close: closeProductCreate,
    open: openProductCreate,
  } = useToggleState()

  const { resetInterval } = usePolling()
  const createBatchJob = useAdminCreateBatchJob()

  const notification = useNotification()

  const createCollection = useAdminCreateCollection()

  useEffect(() => {
    if (location.search.includes("?view=collections")) {
      setView("collections")
    }
  }, [location])

  useEffect(() => {
    location.search = ""
  }, [view])

  const CurrentView = () => {
    switch (view) {
      case "products":
        return <ProductTable />
      default:
        return <CollectionsTable />
    }
  }

  const CurrentAction = () => {
    switch (view) {
      case "products":
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => openImportModal()}
            >
              <UploadIcon size={20} />
              Import Products
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => openExportModal()}
            >
              <ExportIcon size={20} />
              Export Products
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={openProductCreate}
            >
              <PlusIcon size={20} />
              New Product
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowNewCollection(!showNewCollection)}
            >
              <PlusIcon size={20} />
              New Collection
            </Button>
          </div>
        )
    }
  }

  const [showNewCollection, setShowNewCollection] = useState(false)
  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const {
    open: openImportModal,
    close: closeImportModal,
    state: importModalOpen,
  } = useToggleState(false)

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
          navigate(`/a/collections/${collection.id}`)
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
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
            className="h-fit"
          >
            <CurrentView />
          </BodyCard>
          <Spacer />
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
      {importModalOpen && (
        <ImportProducts handleClose={() => closeImportModal()} />
      )}
      <Fade isVisible={createProductState} isFullScreen={true}>
        <NewProduct onClose={closeProductCreate} />
      </Fade>
    </>
  )
}

export default Overview
