import {
  useAdminCollection,
  useAdminDeleteCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import BackButton from "../../../components/atoms/back-button"
import Spacer from "../../../components/atoms/spacer"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../components/molecules/actionables"
import JSONView from "../../../components/molecules/json-view"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { MetadataField } from "../../../components/organisms/metadata"
import RawJSON from "../../../components/organisms/raw-json"
import Section from "../../../components/organisms/section"
import CollectionModal from "../../../components/templates/collection-modal"
import AddProductsTable from "../../../components/templates/collection-product-table/add-product-table"
import ViewProductsTable from "../../../components/templates/collection-product-table/view-products-table"
import useNotification from "../../../hooks/use-notification"
import { useWidgets } from "../../../providers/widget-provider"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import { getErrorStatus } from "../../../utils/get-error-status"
import { useTranslation } from "react-i18next"

const CollectionDetails = () => {
  const { id } = useParams()

  const { collection, isLoading, error, refetch } = useAdminCollection(id!)
  const { t } = useTranslation()
  const deleteCollection = useAdminDeleteCollection(id!)
  const updateCollection = useAdminUpdateCollection(id!)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const navigate = useNavigate()
  const notification = useNotification()
  const [updates, setUpdates] = useState(0)

  const handleDelete = () => {
    deleteCollection.mutate(undefined, {
      onSuccess: () => navigate(`/a/collections`),
    })
  }

  const handleUpdateDetails = (data: any, metadata: MetadataField[]) => {
    const payload: {
      title: string
      handle?: string
      metadata?: object
    } = {
      title: data.title,
      handle: data.handle,
    }

    if (metadata) {
      const base = Object.keys(collection?.metadata ?? {}).reduce(
        (acc, next) => ({ ...acc, [next]: null }),
        {}
      )

      const payloadMetadata = metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value ?? null,
        }
      }, base)

      payload.metadata = payloadMetadata // deleting metadata will not work as it's not supported by the core
    }

    updateCollection.mutate(payload, {
      onSuccess: () => {
        setShowEdit(false)
        refetch()
      },
    })
  }

  const handleAddProducts = async (
    addedIds: string[],
    removedIds: string[]
  ) => {
    try {
      if (addedIds.length > 0) {
        await Medusa.collections.addProducts(collection?.id, {
          product_ids: addedIds,
        })
      }

      if (removedIds.length > 0) {
        await Medusa.collections.removeProducts(collection?.id, {
          product_ids: removedIds,
        })
      }

      setShowAddProducts(false)
      notification(
        t("details-success", "Success"),
        t(
          "details-updated-products-in-collection",
          "Updated products in collection"
        ),
        "success"
      )
      refetch()
    } catch (error) {
      notification(t("details-error", "Error"), getErrorMessage(error), "error")
    }
  }

  useEffect(() => {
    if (collection?.products?.length) {
      setUpdates(updates + 1) // force re-render product table when products are added/removed
    }
  }, [collection?.products])

  const { getWidgets } = useWidgets()

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  if (isLoading || !collection) {
    // temp, perhaps use skeletons?
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <BackButton
          className="mb-xsmall"
          path="/a/products?view=collections"
          label={t("details-back-to-collections", "Back to Collections")}
        />
        <div className="gap-y-xsmall flex flex-col">
          {getWidgets("product_collection.details.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                entity={collection}
                injectionZone="product_collection.details.before"
                widget={w}
              />
            )
          })}

          <div className="rounded-rounded py-large px-xlarge border-grey-20 bg-grey-0 border">
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="inter-xlarge-semibold mb-2xsmall">
                    {collection.title}
                  </h2>
                  <Actionables
                    forceDropdown
                    actions={[
                      {
                        label: t("details-edit-collection", "Edit Collection"),
                        onClick: () => setShowEdit(true),
                        icon: <EditIcon size="20" />,
                      },
                      {
                        label: t("details-delete", "Delete"),
                        onClick: () => setShowDelete(!showDelete),
                        variant: "danger",
                        icon: <TrashIcon size="20" />,
                      },
                    ]}
                  />
                </div>
                <p className="inter-small-regular text-grey-50">
                  /{collection.handle}
                </p>
              </div>
              {collection.metadata && (
                <div className="mt-large gap-y-base flex flex-col">
                  <h3 className="inter-base-semibold">
                    {t("details-metadata", "Metadata")}
                  </h3>
                  <div>
                    <JSONView data={collection.metadata} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Section
            title="Products"
            actions={[
              {
                label: t("details-edit-products", "Edit Products"),
                icon: <EditIcon size="20" />,
                onClick: () => setShowAddProducts(!showAddProducts),
              },
            ]}
          >
            <p className="text-grey-50 inter-base-regular mt-xsmall mb-base">
              {t(
                "details-products-in-this-collection",
                "Products in this collection"
              )}
            </p>
            {collection && (
              <ViewProductsTable
                key={updates} // force re-render when collection is updated
                collectionId={collection.id}
                refetchCollection={refetch}
              />
            )}
          </Section>

          {getWidgets("product_collection.details.after").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                entity={collection}
                injectionZone="product_collection.details.after"
                widget={w}
              />
            )
          })}

          <RawJSON
            data={collection}
            title={t("details-raw-collection", "Raw collection")}
          />
        </div>
        <Spacer />
      </div>
      {showEdit && (
        <CollectionModal
          onClose={() => setShowEdit(!showEdit)}
          onSubmit={handleUpdateDetails}
          isEdit
          collection={collection}
        />
      )}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading={t("details-delete-collection", "Delete collection")}
          successText={t(
            "details-successfully-deleted-collection",
            "Successfully deleted collection"
          )}
          onDelete={async () => handleDelete()}
          confirmText={t("details-yes-delete", "Yes, delete")}
        />
      )}
      {showAddProducts && (
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handleAddProducts}
          existingRelations={collection?.products ?? []}
        />
      )}
    </>
  )
}

export default CollectionDetails
