import { useState } from "react"

import { PublishableApiKey } from "@medusajs/medusa"
import { useAdminCreatePublishableApiKey } from "medusa-react"

import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Fade from "../../../components/atoms/fade-wrapper"
import useToggleState from "../../../hooks/use-toggle-state"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import useNotification from "../../../hooks/use-notification"
import PublishableApiKeysTable from "../tables/publishable-api-keys-table"
import DetailsModal from "../modals/details"

type CreatePublishableKeyProps = {
  closeModal: () => void
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreatePublishableKey(props: CreatePublishableKeyProps) {
  const { closeModal } = props
  const notification = useNotification()

  const { mutateAsync: createPublishableApiKey } =
    useAdminCreatePublishableApiKey()

  const onSubmit = async () => {
    try {
      await createPublishableApiKey({ title: name })
      closeModal()
      notification("Success", "Created a new API key", "success")
    } catch (e) {
      notification("Error", "Failed to create a new API key", "error")
    }
  }

  const [name, setName] = useState("")

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="secondary"
            className="w-8 h-8 p-0 justify-center"
            onClick={closeModal}
          >
            <CrossIcon className="w-5 h-5" />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              onClick={onSubmit}
              disabled={!name}
            >
              Publish API key
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="w-full no-scrollbar flex justify-center">
        <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-8">
            Create API Key
          </h1>
          <h5 className="inter-base-semibold text-grey-90 pb-1">
            General Information
          </h5>
          <p className="text-grey-50 pb-8">
            Create and manage API keys. Right now this is only related to sales
            channels.
          </p>
          <InputField
            label="Title"
            type="string"
            name="name"
            value={name}
            className="w-[338px]"
            placeholder="Name your key"
            onChange={(ev) => setName(ev.target.value)}
          />
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

/**
 * Index page container for the "Publishable API keys" page
 */
function Index() {
  const [selectedKey, setSelectedKey] = useState<PublishableApiKey>()

  const [isCreateModalVisible, openCreateModal, closeCreateModal] =
    useToggleState(false)

  const actions = [
    {
      label: "Create API key",
      onClick: openCreateModal,
    },
  ]

  return (
    <div>
      <Breadcrumb
        currentPage="Publishable API Keys"
        previousBreadcrumb="Settings"
        previousRoute="/a/settings"
      />
      <BodyCard
        title="Publishable API keys"
        subtitle="These publishable keys will allow you to authenticate API requests."
        actionables={actions}
      >
        <PublishableApiKeysTable showDetailsModal={setSelectedKey} />
        <DetailsModal
          selectedKey={selectedKey}
          close={() => setSelectedKey(undefined)}
        />
        <Fade isVisible={isCreateModalVisible} isFullScreen>
          <CreatePublishableKey closeModal={closeCreateModal} />
        </Fade>
      </BodyCard>
    </div>
  )
}

export default Index
