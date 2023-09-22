import { Discount, DiscountCondition } from "@medusajs/medusa"
import {
  useAdminAddDiscountConditionResourceBatch,
  useAdminDeleteDiscountConditionResourceBatch,
} from "medusa-react"
import { createContext, ReactNode, useContext } from "react"
import { useTranslation } from "react-i18next"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../../hooks/use-notification"

type ConditionsProviderProps = {
  condition: DiscountCondition
  discount: Discount
  onClose: () => void
  children: ReactNode
}

type EditConditionContextType = {
  condition: DiscountCondition
  discount: Discount
  isLoading: boolean
  saveAndClose: (resources: string[]) => void
  saveAndGoBack: (resources: string[]) => void
  removeConditionResources: (resources: string[]) => void
}

const EditConditionContext = createContext<EditConditionContextType | null>(
  null
)

export const EditConditionProvider = ({
  condition,
  discount,
  onClose,
  children,
}: ConditionsProviderProps) => {
  const { t } = useTranslation()
  const notification = useNotification()

  const { pop, reset } = useContext(LayeredModalContext)

  const addConditionResourceBatch = useAdminAddDiscountConditionResourceBatch(
    discount.id,
    condition.id
  )

  const removeConditionResourceBatch =
    useAdminDeleteDiscountConditionResourceBatch(discount.id, condition.id)

  const addConditionResources = (
    resourcesToAdd: string[],
    onSuccessCallback?: () => void
  ) => {
    addConditionResourceBatch.mutate(
      { resources: resourcesToAdd.map((r) => ({ id: r })) },
      {
        onSuccess: () => {
          notification(
            t("edit-condition-success", "Success"),
            t(
              "edit-condition-the-resources-were-successfully-added",
              "The resources were successfully added"
            ),
            "success"
          )
          onSuccessCallback?.()
        },
        onError: () =>
          notification(
            t("edit-condition-error", "Error"),
            t(
              "edit-condition-failed-to-add-resources",
              "Failed to add resources"
            ),
            "error"
          ),
      }
    )
  }

  const removeConditionResources = (resourcesToRemove: string[]) => {
    removeConditionResourceBatch.mutate(
      { resources: resourcesToRemove.map((r) => ({ id: r })) },
      {
        onSuccess: () => {
          notification(
            t("edit-condition-success", "Success"),
            t(
              "edit-condition-the-resources-were-successfully-removed",
              "The resources were successfully removed"
            ),
            "success"
          )
        },
        onError: () =>
          notification(
            t("edit-condition-error", "Error"),
            t(
              "edit-condition-failed-to-remove-resources",
              "Failed to remove resources"
            ),
            "error"
          ),
      }
    )
  }

  function saveAndClose(resourcesToAdd: string[]) {
    addConditionResources(resourcesToAdd, () => onClose())
    reset()
  }

  function saveAndGoBack(resourcesToRemove: string[]) {
    addConditionResources(resourcesToRemove)
    pop()
  }

  return (
    <EditConditionContext.Provider
      value={{
        condition,
        discount,
        removeConditionResources,
        saveAndClose,
        saveAndGoBack,
        isLoading:
          addConditionResourceBatch.isLoading ||
          removeConditionResourceBatch.isLoading,
      }}
    >
      {children}
    </EditConditionContext.Provider>
  )
}

export const useEditConditionContext = () => {
  const { t } = useTranslation()
  const context = useContext(EditConditionContext)
  if (context === null) {
    throw new Error(
      t(
        "edit-condition-use-edit-condition-context-must-be-used-within-an-edit-condition-provider",
        "useEditConditionContext must be used within an EditConditionProvider"
      )
    )
  }
  return context
}
