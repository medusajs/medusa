import clsx from "clsx"
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import AmountField from "react-currency-input-field"
import { Option } from "../../../types/shared"
import { currencies, CurrencyType } from "../../../utils/currencies"
import { normalizeAmount, persistedPrice } from "../../../utils/prices"
import InputError from "../../atoms/input-error"
import Tooltip from "../../atoms/tooltip"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputHeader from "../../fundamentals/input-header"
import Input from "../../molecules/input"
import Select from "../../molecules/select"

type CurrencyInputProps = {
  currencyCodes?: string[]
  currentCurrency?: string
  size?: "small" | "medium" | "full"
  readOnly?: boolean
  hideCurrency?: boolean
  onChange?: (currencyCode: string) => void
  className?: React.HTMLAttributes<HTMLDivElement>["className"]
  children?: React.ReactNode
}

type CurrencyInputState = {
  currencyInfo: CurrencyType | undefined
}

type AmountInputProps = {
  label?: string
  amount: number | undefined
  required?: boolean
  step?: number
  allowNegative?: boolean
  onChange?: (amount: number | undefined) => void
  onValidate?: (amount: number | undefined) => boolean
  invalidMessage?: string
  errors?: { [x: string]: unknown }
  name?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">

const CurrencyContext = React.createContext<CurrencyInputState>({
  currencyInfo: undefined,
})

const getCurrencyInfo = (currencyCode?: string) => {
  if (!currencyCode) {
    return undefined
  }
  const currencyInfo = currencies[currencyCode.toUpperCase()]
  return currencyInfo
}

const Root: React.FC<CurrencyInputProps> = ({
  currentCurrency,
  currencyCodes,
  size = "full",
  readOnly = false,
  hideCurrency = false,
  onChange,
  children,
  className,
}) => {
  const options: Option[] =
    currencyCodes?.map((code) => ({
      label: code.toUpperCase(),
      value: code,
    })) ?? []

  const [selectedCurrency, setSelectedCurrency] = useState<
    CurrencyType | undefined
  >(getCurrencyInfo(currentCurrency))

  const [value, setValue] = useState<Option | null>(
    currentCurrency
      ? {
        label: currentCurrency.toUpperCase(),
        value: currentCurrency,
      }
      : null
  )

  useEffect(() => {
    if (currentCurrency) {
      setSelectedCurrency(getCurrencyInfo(currentCurrency))
      setValue({
        label: currentCurrency.toUpperCase(),
        value: currentCurrency,
      })
    }
  }, [currentCurrency])

  const onCurrencyChange = (currency: Option) => {
    // Should not be nescessary, but the component we use for select input
    // has a bug where it passes a null object if you click on the label
    // of the already selected value
    if (!currency) {
      return
    }

    setValue(currency)
    setSelectedCurrency(getCurrencyInfo(currency.value))

    if (onChange) {
      onChange(currency.value)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currencyInfo: selectedCurrency,
      }}
    >
      <div className={clsx("flex items-center gap-x-xsmall", className)}>
        {!hideCurrency && (
          <div
            className={clsx(
              { "w-[144px]": size === "medium" },
              { "w-[120px]": size === "small" },
              { "flex-1": size === "full" }
            )}
          >
            {!readOnly ? (
              <Select
                enableSearch
                label="Currency"
                value={value}
                onChange={onCurrencyChange}
                options={options}
                disabled={readOnly}
              />
            ) : (
              <Input
                label="Currency"
                value={value?.label}
                readOnly
                className="pointer-events-none"
                tabIndex={-1}
              />
            )}
          </div>
        )}
        {children && <div className="flex-1">{children}</div>}
      </div>
    </CurrencyContext.Provider>
  )
}

const Amount = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      label,
      required = false,
      amount,
      step = 1,
      allowNegative = false,
      onChange,
      onValidate,
      invalidMessage,
      errors,
      name,
      ...rest
    }: AmountInputProps,
    ref
  ) => {
    const { currencyInfo } = useContext(CurrencyContext)
    const [invalid, setInvalid] = useState<boolean>(false)
    const [formattedValue, setFormattedValue] = useState<string | undefined>(
      amount ? `${normalizeAmount(currencyInfo?.code!, amount)}` : undefined
    )
    const inputRef = useRef<HTMLInputElement | null>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    )

    useEffect(() => {
      inputRef.current?.dispatchEvent(new Event("blur"))
    }, [currencyInfo?.decimal_digits])

    useEffect(() => {
      if (currencyInfo && amount) {
        setFormattedValue(`${normalizeAmount(currencyInfo?.code, amount)}`)
      }
    }, [amount])

    const handleChange = (value?: string, floatValue?: number | null) => {
      let persistedAmount: number | undefined = undefined

      if (typeof floatValue === "number" && currencyInfo) {
        persistedAmount = Math.round(
          persistedPrice(currencyInfo.code, floatValue)
        )
      } else {
        persistedAmount = undefined
      }

      if (onChange) {
        let update = true

        if (onValidate) {
          update = onValidate(persistedAmount)
        }

        if (update) {
          onChange(persistedAmount)
          setInvalid(false)
        } else {
          setInvalid(true)
          return // Don't update the value if it's invalid
        }
      }

      setFormattedValue(value)
    }

    const handleManualValueChange = (val: number) => {
      const newValue = parseFloat(formattedValue ?? "0") + val

      if (!allowNegative && newValue < 0) {
        return
      }

      handleChange(`${newValue}`, newValue)
    }

    return (
      <div {...rest}>
        <InputHeader label={label} required={required} className="mb-xsmall" />
        <div
          className={clsx(
            "w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded h-10 focus-within:shadow-input focus-within:border-violet-60",
            {
              "border-rose-50 focus-within:shadow-cta focus-within:shadow-rose-60/10 focus-within:border-rose-50":
                errors && name && errors[name],
            }
          )}
        >
          {currencyInfo?.symbol_native && (
            <Tooltip
              open={invalid}
              side={"top"}
              content={invalidMessage || "Amount is not valid"}
            >
              <span className="inter-base-regular text-grey-40 mr-xsmall">
                {currencyInfo.symbol_native}
              </span>
            </Tooltip>
          )}
          <AmountField
            className="bg-transparent outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
            decimalScale={currencyInfo?.decimal_digits}
            value={formattedValue}
            onValueChange={(value, _name, values) =>
              handleChange(value, values?.float)
            }
            ref={inputRef}
            step={step}
            allowNegativeValue={allowNegative}
            placeholder="0.00"
            name={name}
          />
          <div className="flex items-center">
            <button
              className="mr-2 text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              type="button"
              onClick={() => handleManualValueChange(-step)}
            >
              <MinusIcon size={16} />
            </button>
            <button
              type="button"
              className="text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              onClick={() => handleManualValueChange(step)}
            >
              <PlusIcon size={16} />
            </button>
          </div>
        </div>
        <InputError name={name} errors={errors} />
      </div>
    )
  }
)

export default { Root, Amount }
