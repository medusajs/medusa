import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Spinner from "../../../components/atoms/spinner"
import Toaster from "../../../components/declarative-toaster"
import FormToasterContainer from "../../../components/molecules/form-toaster"
import { checkForDirtyState } from "../../../utils/form-helpers"
import {
  GiftCardFormProvider,
  useGiftCardForm,
} from "./form/gift-card-form-context"
import { giftCardToFormValuesMapper } from "./form/mappers"
import Denominations from "./sections/denominations"
import Images from "./sections/images"
import Information from "./sections/information"

const ManageGiftCard = () => {
  const { products } = useAdminProducts(
    {
      is_giftcard: true,
    },
    {
      keepPreviousData: true,
    }
  )

  const giftCard = products?.[0]

  if (!giftCard) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner variant="secondary" size="large" />
      </div>
    )
  }

  return (
    <GiftCardFormProvider
      giftCard={giftCardToFormValuesMapper(giftCard)}
      giftCardId={giftCard.id}
    >
      <div className="flex flex-col gap-y-large pb-xlarge">
        <Information giftCard={giftCard} />
        <Denominations giftCard={giftCard} />
        <Images />
      </div>
      <UpdateNotification />
    </GiftCardFormProvider>
  )
}

const TOAST_ID = "edit-gc-dirty"

const UpdateNotification = ({ isLoading = false }) => {
  const {
    form: { formState },
    onUpdate,
    resetForm,
    additionalDirtyState,
  } = useGiftCardForm()
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(setBlocking, 300, false)
    return () => clearTimeout(timeout)
  }, [])

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

  useEffect(() => {
    if (!blocking) {
      setVisible(isDirty)
    }

    return () => {
      toast.dismiss(TOAST_ID)
    }
  }, [isDirty])

  return (
    <Toaster
      visible={visible}
      duration={Infinity}
      id={TOAST_ID}
      position="bottom-right"
    >
      <FormToasterContainer isLoading={isLoading}>
        <FormToasterContainer.Actions>
          <FormToasterContainer.ActionButton onClick={onUpdate}>
            Save
          </FormToasterContainer.ActionButton>
          <FormToasterContainer.DiscardButton onClick={resetForm}>
            Discard
          </FormToasterContainer.DiscardButton>
        </FormToasterContainer.Actions>
      </FormToasterContainer>
    </Toaster>
  )
}

export default ManageGiftCard
