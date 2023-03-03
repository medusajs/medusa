import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
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
        <div className="min-h-[705px] gap-y-xsmall">
          <InputField
            placeholder="E.g. Gift wrapping"
            label="Title"
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
              label="Price"
              amount={amount}
              onChange={(value) => setAmount(value || 0)}
            />
          </CurrencyInput.Root>
          <InputField
            className="my-4"
            label="Quantity"
            {...register("quantity", { required: true })}
            type="number"
            required
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            onClick={handleSubmit(onSubmitItem)}
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default CustomItemSubModal
