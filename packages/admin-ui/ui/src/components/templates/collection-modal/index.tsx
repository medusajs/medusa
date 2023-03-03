import { ProductCollection } from "@medusajs/medusa"
import {
  useAdminCreateCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import IconTooltip from "../../molecules/icon-tooltip"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Metadata, { MetadataField } from "../../organisms/metadata"

type CollectionModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  isEdit?: boolean
  collection?: ProductCollection
}

type CollectionModalFormData = {
  title: string
  handle: string | undefined
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  onClose,
  isEdit = false,
  collection,
}) => {
  const { mutate: update, isLoading: updating } = useAdminUpdateCollection(
    collection?.id!
  )
  const { mutate: create, isLoading: creating } = useAdminCreateCollection()

  const { register, handleSubmit, reset } = useForm<CollectionModalFormData>()

  const notification = useNotification()
  const [metadata, setMetadata] = useState<MetadataField[]>([])

  if (isEdit && !collection) {
    throw new Error("Collection is required for edit")
  }

  useEffect(() => {
    register("title", { required: true })
    register("handle")
  }, [])

  useEffect(() => {
    if (isEdit && collection) {
      reset({
        title: collection.title,
        handle: collection.handle,
      })

      if (collection.metadata) {
        Object.entries(collection.metadata).map(([key, value]) => {
          if (typeof value === "string") {
            const newMeta = metadata
            newMeta.push({ key, value })
            setMetadata(newMeta)
          }
        })
      }
    }
  }, [collection, isEdit])

  const submit = (data: CollectionModalFormData) => {
    if (isEdit) {
      update(
        {
          title: data.title,
          handle: data.handle,
          metadata: metadata.reduce((acc, next) => {
            return {
              ...acc,
              [next.key]: next.value,
            }
          }, {}),
        },
        {
          onSuccess: () => {
            notification(
              "Success",
              "Successfully updated collection",
              "success"
            )
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    } else {
      create(
        {
          title: data.title,
          handle: data.handle,
          metadata: metadata.reduce((acc, next) => {
            return {
              ...acc,
              [next.key]: next.value,
            }
          }, {}),
        },
        {
          onSuccess: () => {
            notification(
              "Success",
              "Successfully created collection",
              "success"
            )
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    }
  }

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit ? "Edit Collection" : "Add Collection"}
            </h1>
            <p className="inter-small-regular text-grey-50">
              To create a collection, all you need is a title and a handle.
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb-base">Details</h2>
              <div className="flex items-center gap-x-base">
                <InputField
                  label="Title"
                  required
                  placeholder="Sunglasses"
                  {...register("title", { required: true })}
                />
                <InputField
                  label="Handle"
                  placeholder="sunglasses"
                  {...register("handle")}
                  prefix="/"
                  tooltip={
                    <IconTooltip content="URL Slug for the collection. Will be auto generated if left blank." />
                  }
                />
              </div>
            </div>
            <div className="mt-xlarge w-full">
              <Metadata setMetadata={setMetadata} metadata={metadata} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isEdit ? updating : creating}
              >
                {`${isEdit ? "Save" : "Publish"} collection`}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CollectionModal
