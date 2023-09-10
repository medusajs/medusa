import { useState } from "react"
import { useAdminCreateSalesChannel } from "medusa-react"
import { useTranslation } from "react-i18next"

import Button from "../../../components/fundamentals/button"

import FocusModal from "../../../components/molecules/modal/focus-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import Accordion from "../../../components/organisms/accordion"
import InputField from "../../../components/molecules/input"
import useNotification from "../../../hooks/use-notification"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

type GeneralProps = {
  name: string
  description: string
  setName: (name: string) => void
  setDescription: (description: string) => void
}

/**
 * General section for the SC create form.
 */
function General(props: GeneralProps) {
  const { name, description, setName, setDescription } = props
  const { t } = useTranslation()

  return (
    <div className="gap-y-base my-base flex flex-col">
      <div className="flex-1">
        <InputField
          label={t("form-title", "Title")}
          type="string"
          name="name"
          placeholder={t(
            "form-website-app-amazon-physical-store-pos-facebook-product-feed",
            "Website, app, Amazon, physical store POS, facebook product feed..."
          )}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </div>
      <div className="flex-1">
        <InputField
          label={t("form-description", "Description")}
          type="string"
          name="description"
          placeholder={t(
            "form-available-products-at-our-website-app",
            "Available products at our website, app..."
          )}
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </div>
    </div>
  )
}

function AddProducts() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <sapn className="text-gray-500">
        Select products that will be available via this channel. You can assign
        products to multiple channels.
      </sapn>
      <Button
        size="small"
        type="button"
        variant="secondary"
        className="mt-6 h-[40px] w-full"
        onClick={() => setShowModal(true)}
      >
        <PlusIcon size={20} />
        Add Products
      </Button>
      {/* {showModal && (*/}
      {/*  <SalesChannelAvaliableProductsModal*/}
      {/*    handleClose={() => setShowModal(false)}*/}
      {/*  />*/}
      {/* )}*/}
    </div>
  )
}

type AddSalesChannelModalProps = {
  onClose: (scId: string) => void
}

/**
 * Modal for creating sales channels.
 */
const AddSalesChannelModal = ({ onClose }: AddSalesChannelModalProps) => {
  const { mutate: createSalesChannel } = useAdminCreateSalesChannel()

  const notification = useNotification()

  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()

  async function save() {
    await createSalesChannel(
      { name, description },
      {
        onSuccess: ({ sales_channel }) => {
          notification(
            "Success",
            "The sales channel is successfully created",
            "success"
          )
          onClose(sales_channel.id)
        },
        onError: () =>
          notification("Error", "Failed to create the sales channel", "error"),
      }
    )
  }

  async function saveAsDraft() {
    await createSalesChannel(
      {
        name,
        description,
        is_disabled: true,
      },
      {
        onSuccess: ({ sales_channel }) => {
          notification(
            "Success",
            "The sales channel is successfully created",
            "success"
          )
          onClose(sales_channel.id)
        },
        onError: () =>
          notification("Error", "Failed to create the sales channel", "error"),
      }
    )
  }

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 flex w-full justify-between px-8">
          <Button
            size="small"
            variant="ghost"
            onClick={onClose}
            className="rounded-rounded h-8 w-8 border"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="secondary"
              onClick={() => saveAsDraft()}
              disabled={!name}
              className="rounded-rounded"
            >
              Save as draft
            </Button>

            <Button
              size="small"
              variant="primary"
              onClick={() => save()}
              disabled={!name}
              className="rounded-rounded"
            >
              Publish channel
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="mb-[25%] flex justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold">Create new sales channel</h1>
            <Accordion
              className="text-grey-90 pt-7"
              defaultValue={["general"]}
              type="multiple"
            >
              <Accordion.Item
                title="General info"
                value="general"
                forceMountContent
              >
                <General
                  name={name}
                  description={description}
                  setName={setName}
                  setDescription={setDescription}
                />
              </Accordion.Item>
              {/* TODO: add a modal for initially selecting products*/}
              {/* <Accordion.Item title="Products" value="products">*/}
              {/*  <AddProducts />*/}
              {/* </Accordion.Item>*/}
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AddSalesChannelModal
