import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import CurrencyInput from "../../../../components/organisms/currency-input"

type CustomItemSubModalProps = {
  onSubmit: (title: string, amount: number, quantity: number) => void
  region: any
}

const CustomItemSubModal: React.FC<CustomItemSubModalProps> = ({
  onSubmit,
  region,
}) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState(0)
  const { pop } = useContext(LayeredModalContext)

  const { register, handleSubmit } = useForm()

  const onSubmitItem = (data) => {
    const { title, quantity } = data
    onSubmit(title, quantity, amount)
    pop()
  }

  return (
    <>
      <Modal.Content>
        <div className="gap-y-xsmall min-h-[705px]">
          <InputField
            placeholder={t(
              "components-e-g-gift-wrapping",
              "E.g. Gift wrapping"
            )}
            label={t("components-title", "Title")}
            {...register("title", { required: true })}
            className="my-4"
            required
          />
          <CurrencyInput.Root
            currentCurrency={region.currency_code}
            size="small"
            readOnly
          >
            <CurrencyInput.Amount
              required
              label={t("components-price", "Price")}
              amount={amount}
              onChange={(value) => setAmount(value || 0)}
            />
          </CurrencyInput.Root>
          <InputField
            className="my-4"
            label={t("components-quantity", "Quantity")}
            {...register("quantity", { required: true })}
            type="number"
            required
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            {t("components-back", "Back")}
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            onClick={handleSubmit(onSubmitItem)}
          >
            {t("components-add", "Add")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default CustomItemSubModal
