import { useAdminReturnReasons } from "medusa-react"
import { useState } from "react"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import useModal from "../../../hooks/use-toggle-state"
import CreateReturnReasonModal from "./create-reason-modal"
import ReturnReasonDetail from "./detail"

const ReturnReasons = () => {
  const { state: isOpen, open, close } = useModal()
  const [selectedReason, setSelectedReason] = useState<any>(null)
  const { isLoading, return_reasons } = useAdminReturnReasons({
    onSuccess: (data) => {
      // sorting is done in place
      sortByCreatedAt(data.return_reasons)

      const newReturnReasons = data.return_reasons
      // if this is the first time we fetch this list
      // or if this is a refetch after a deletion
      // then set the first element as the selected reason
      if (!selectedReason || isADeletion(return_reasons, newReturnReasons)) {
        setSelectedReason(newReturnReasons[0])
      }
    },
  })

  return (
    <div>
      <BackButton
        path="/a/settings"
        label="Back to settings"
        className="mb-xsmall"
      />
      <TwoSplitPane>
        <BodyCard
          title="Return Reasons"
          actionables={[
            {
              label: "Add reason",
              icon: (
                <span className="text-grey-90">
                  <PlusIcon size={20} />
                </span>
              ),
              onClick: open,
            },
          ]}
          subtitle="Manage reasons for returned items"
        >
          <div className="mt-large">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner variant="secondary" />
              </div>
            ) : (
              <RadioGroup.Root
                onValueChange={(value) =>
                  setSelectedReason(findReasonByValue(return_reasons, value))
                }
                value={selectedReason?.value}
              >
                {return_reasons?.map((reason) => (
                  <RadioGroup.Item
                    key={reason.id}
                    label={reason.label}
                    description={reason.description}
                    className="mt-xsmall"
                    value={reason.value}
                  />
                ))}
              </RadioGroup.Root>
            )}
          </div>
        </BodyCard>
        {selectedReason && <ReturnReasonDetail reason={selectedReason} />}
      </TwoSplitPane>
      {isOpen && <CreateReturnReasonModal handleClose={close} />}
    </div>
  )
}

const isADeletion = (returnReasons, newReturnReasons) =>
  returnReasons && returnReasons?.length > newReturnReasons?.length

const sortByCreatedAt = <T extends Record<string, any>>(returnReasons: T[]) =>
  returnReasons?.sort((a, b) => (a.created_at < b.created_at ? -1 : 1))

const findReasonByValue = (reasons, value) => {
  return reasons.find((reason) => reason.value === value)
}

export default ReturnReasons
