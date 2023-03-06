import { useAdminUpdateProduct } from "medusa-react"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"
import { handleFormError } from "../../../../utils/handle-form-error"
import { trimValues } from "../../../../utils/trim-values"
import { ManageGiftCardFormData } from "../utils/types"
import { formValuesToUpdateGiftCardMapper } from "./mappers"

type GiftCardFormProviderProps = {
  giftCardId: string
  giftCard: ManageGiftCardFormData
  children: React.ReactNode
}

export const GiftCardFormProvider = ({
  giftCardId,
  giftCard,
  children,
}: GiftCardFormProviderProps) => {
  const [imageDirtyState, setImageDirtyState] = useState(false)

  const methods = useForm<ManageGiftCardFormData>()

  const resetForm = () => {
    methods.reset({
      handle: giftCard.handle || undefined,
      description: giftCard.description || undefined,
      subtitle: giftCard.subtitle || undefined,
      tags: giftCard.tags || [],
      title: giftCard.title || undefined,
      type: giftCard.type || undefined,
      thumbnail: giftCard.thumbnail || 0,
      images: giftCard.images || [],
    })
    setImageDirtyState(false)
  }

  useEffect(() => {
    resetForm()
  }, [giftCard])

  const { mutate: update } = useAdminUpdateProduct(giftCardId)
  const notification = useNotification()

  const onUpdate = methods.handleSubmit(async (values) => {
    const cleanedValues = trimValues(values)

    const payload = await formValuesToUpdateGiftCardMapper(cleanedValues)

    update(payload, {
      onSuccess: () => {
        notification("Success", "Product updated successfully", "success")
      },
    })
  }, handleFormError)

  return (
    <FormProvider {...methods}>
      <GiftCardFormContext.Provider
        value={{
          onUpdate,
          resetForm,
          setImageDirtyState,
          additionalDirtyState: {
            images: imageDirtyState,
          },
        }}
      >
        <form>{children}</form>
      </GiftCardFormContext.Provider>
    </FormProvider>
  )
}

const GiftCardFormContext = React.createContext<{
  onUpdate: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>
  resetForm: () => void
  setImageDirtyState: (value: boolean) => void
  additionalDirtyState: Record<string, boolean>
} | null>(null)

export const useGiftCardForm = () => {
  const context = React.useContext(GiftCardFormContext)
  const form = useFormContext<ManageGiftCardFormData>()
  if (!context) {
    throw new Error("useGiftCardForm must be a child of GiftCardFormContext")
  }
  return { form, ...context }
}
