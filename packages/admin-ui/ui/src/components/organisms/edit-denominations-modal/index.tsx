import _ from "lodash"
import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import IconTooltip from "../../molecules/icon-tooltip"
import Modal from "../../molecules/modal"
import CurrencyInput from "../../organisms/currency-input"

export type PriceType = {
  currency_code: string
  amount: number
  id?: string
}

type EditDenominationsModalProps = {
  defaultDenominations: PriceType[]
  handleClose: () => void
  onSubmit: (denominations: PriceType[]) => void
  defaultNewAmount?: number
  defaultNewCurrencyCode?: string
  currencyCodes?: string[]
}

const EditDenominationsModal = ({
  defaultDenominations = [],
  onSubmit,
  handleClose,
  currencyCodes = [],
  defaultNewAmount = 1000,
}: EditDenominationsModalProps) => {
  const [denominations, setDenominations] = React.useState(
    augmentWithIds(defaultDenominations)
  )
  const selectedCurrencies = denominations.map(
    (denomination) => denomination.currency_code
  )
  const availableCurrencies = currencyCodes?.filter(
    (currency) => !selectedCurrencies.includes(currency)
  )

  const onAmountChange = (index) => {
    return (amount) => {
      const newDenominations = denominations.slice()
      newDenominations[index] = { ...newDenominations[index], amount }
      setDenominations(newDenominations)
    }
  }

  const onCurrencyChange = (index) => {
    return (currencyCode) => {
      const newDenominations = denominations.slice()
      newDenominations[index] = {
        ...newDenominations[index],
        currency_code: currencyCode,
      }
      setDenominations(newDenominations)
    }
  }

  const onClickDelete = (index) => {
    return () => {
      const newDenominations = denominations.slice()
      newDenominations.splice(index, 1)
      setDenominations(newDenominations)
    }
  }

  const appendDenomination = () => {
    const newDenomination = {
      amount: defaultNewAmount,
      currency_code: availableCurrencies[0],
    }
    setDenominations([...denominations, augmentWithId(newDenomination)])
  }

  const submitHandler = () => {
    const strippedDenominations = stripDenominationFromIndexId(denominations)

    if (onSubmit) {
      onSubmit(strippedDenominations)
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Edit Denominations</span>
        </Modal.Header>
        <Modal.Content>
          <div className="pt-1">
            <div className="flex items-center">
              <label className="inter-base-semibold text-grey-90 mr-1.5">
                Prices
              </label>
              <IconTooltip content={"Helpful denominations"} />
            </div>
            {denominations.map((field, index) => {
              return (
                <div
                  key={field.indexId}
                  className="first:mt-0 mt-xsmall flex items-center"
                >
                  <div className="flex-1">
                    <CurrencyInput.Root
                      currencyCodes={currencyCodes}
                      currentCurrency={field.currency_code}
                      onChange={onCurrencyChange(index)}
                      size="medium"
                    >
                      <CurrencyInput.Amount
                        label="Amount"
                        onChange={onAmountChange(index)}
                        amount={field.amount}
                      />
                    </CurrencyInput.Root>
                  </div>
                  <button className="ml-2xlarge">
                    <TrashIcon
                      onClick={onClickDelete(index)}
                      className="text-grey-40"
                      size="20"
                    />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="mt-large">
            <Button
              onClick={appendDenomination}
              type="button"
              variant="ghost"
              size="small"
              disabled={availableCurrencies.length === 0}
            >
              <PlusIcon size={20} />
              Add a price
            </Button>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2 min-w-[130px] justify-center"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              className="mr-2 min-w-[130px] justify-center"
              onClick={submitHandler}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditDenominationsModal

const augmentWithId = (obj) => ({ ...obj, indexId: uuidv4() })

const augmentWithIds = (list) => {
  return list.map(augmentWithId)
}

const stripDenominationFromIndexId = (list) => {
  return list.map((element) => _.omit(element, "indexId"))
}
