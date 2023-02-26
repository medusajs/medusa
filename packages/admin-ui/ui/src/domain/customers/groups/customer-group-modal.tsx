import {
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
  CustomerGroup,
} from "@medusajs/medusa"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Metadata, { MetadataField } from "../../../components/organisms/metadata"

type CustomerGroupModalProps = {
  handleClose: () => void
  initialData?: CustomerGroup
  handleSubmit: (
    data: AdminPostCustomerGroupsReq | AdminPostCustomerGroupsGroupReq
  ) => void
}

/*
 * A modal for crating/editing customer groups.
 */
function CustomerGroupModal(props: CustomerGroupModalProps) {
  const { initialData, handleSubmit, handleClose } = props

  const isEdit = !!initialData

  const [metadata, setMetadata] = useState<MetadataField[]>(
    isEdit
      ? Object.keys(initialData.metadata || {}).map((k) => ({
          key: k,
          value: initialData.metadata[k],
        }))
      : []
  )

  const { register, handleSubmit: handleFromSubmit } = useForm({
    defaultValues: initialData,
  })

  const onSubmit = (data) => {
    const meta = {}
    const initial = props.initialData?.metadata || {}

    metadata.forEach((m) => (meta[m.key] = m.value))

    for (const m in initial) {
      if (!(m in meta)) {
        meta[m] = null
      }
    }

    const toSubmit = {
      name: data.name,
      metadata: meta,
    }
    handleSubmit(toSubmit)
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {props.initialData ? "Edit" : "Create a New"} Customer Group
          </span>
        </Modal.Header>

        <Modal.Content>
          <div className="space-y-4">
            <span className="inter-base-semibold">Details</span>
            <div className="flex space-x-4">
              <Input
                label="Title"
                {...register("name")}
                placeholder="Customer group name"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <Metadata metadata={metadata} setMetadata={setMetadata} />
          </div>
        </Modal.Content>

        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="medium"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleFromSubmit(onSubmit)}
            >
              <span>{props.initialData ? "Edit" : "Publish"} Group</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CustomerGroupModal
