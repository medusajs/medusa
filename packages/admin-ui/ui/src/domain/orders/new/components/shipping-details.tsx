import qs from "query-string"
import React, { useContext, useEffect, useMemo, useState } from "react"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import AddressForm, {
  AddressType,
} from "../../../../components/templates/address-form"
import Medusa from "../../../../services/api"

import { useAdminCustomer } from "medusa-react"
import { Controller, useWatch } from "react-hook-form"
import LockIcon from "../../../../components/fundamentals/icons/lock-icon"
import InputField from "../../../../components/molecules/input"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Select from "../../../../components/molecules/select"
import RadioGroup from "../../../../components/organisms/radio-group"
import { Option } from "../../../../types/shared"
import isNullishObject from "../../../../utils/is-nullish-object"
import mapAddressToForm from "../../../../utils/map-address-to-form"
import { nestedForm } from "../../../../utils/nested-form"
import { useNewOrderForm } from "../form"

const ShippingDetails = () => {
  const [addNew, setAddNew] = useState(false)
  const { disableNextPage, enableNextPage } = useContext(SteppedContext)

  const {
    context: { validCountries },
    form,
  } = useNewOrderForm()

  const debouncedFetch = async (filter: string): Promise<Option[]> => {
    const prepared = qs.stringify(
      {
        q: filter,
        offset: 0,
        limit: 10,
      },
      { skipNull: true, skipEmptyString: true }
    )

    return await Medusa.customers
      .list(`?${prepared}`)
      .then(({ data }) =>
        data.customers.map(({ id, first_name, last_name, email }) => ({
          label: `${first_name || ""} ${last_name || ""} (${email})`,
          value: id,
        }))
      )
      .catch(() => [])
  }

  const customerId = useWatch({
    control: form.control,
    name: "customer_id",
  })

  const { customer, isLoading } = useAdminCustomer(customerId?.value!, {
    enabled: !!customerId?.value,
  })

  const validAddresses = useMemo(() => {
    if (!customer) {
      return []
    }

    const validCountryCodes = validCountries.map(({ value }) => value)

    return customer.shipping_addresses.filter(
      ({ country_code }) =>
        !country_code || validCountryCodes.includes(country_code)
    )
  }, [customer])

  const onCustomerSelect = (val: Option) => {
    const email = /\(([^()]*)\)$/.exec(val?.label)

    if (email) {
      form.setValue("email", email[1])
    }
  }

  const onCreateNew = () => {
    form.setValue("shipping_address_id", undefined)
    setAddNew(true)
  }

  const onSelectExistingAddress = (id: string) => {
    if (!customer) {
      return
    }

    const address = customer.shipping_addresses?.find((a) => a.id === id)

    if (address) {
      form.setValue("shipping_address", mapAddressToForm(address))
    }
  }

  const email = useWatch({
    control: form.control,
    name: "email",
  })

  useEffect(() => {
    if (!email) {
      disableNextPage()
    } else {
      enableNextPage()
    }
  }, [email])

  const shippingAddress = useWatch({
    control: form.control,
    name: "shipping_address",
  })

  const [requiredFields, setRequiredFields] = useState(false)

  useEffect(() => {
    if (!email) {
      disableNextPage()
      return
    }

    if (shippingAddress && !isNullishObject(shippingAddress)) {
      if (
        !shippingAddress.first_name ||
        !shippingAddress.last_name ||
        !shippingAddress.address_1 ||
        !shippingAddress.city ||
        !shippingAddress.country_code ||
        !shippingAddress.postal_code
      ) {
        disableNextPage()
        setRequiredFields(true)
      } else {
        enableNextPage()
      }
    } else {
      enableNextPage()
      setRequiredFields(false)
    }
  }, [shippingAddress, email])

  return (
    <div className="min-h-[705px] flex flex-col gap-y-8">
      <div>
        <span className="inter-base-semibold">
          Customer and shipping details
        </span>
        <Controller
          control={form.control}
          name="customer_id"
          render={({ field: { value, onChange } }) => {
            return (
              <Select
                className="mt-4"
                label="Find existing customer"
                options={[]}
                enableSearch
                value={value || null}
                onChange={(val) => {
                  onCustomerSelect(val)
                  onChange(val)
                }}
                filterOptions={debouncedFetch as any}
                clearSelected
              />
            )
          }}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <span className="inter-base-semibold">Email</span>
        <InputField
          {...form.register("email")}
          label="Email"
          placeholder="lebron@james.com"
          disabled={!!customerId}
          required
          // @ts-ignore
          prefix={
            !!customerId ? (
              <LockIcon size={16} className="text-grey-40" />
            ) : undefined
          }
          tabIndex={!!customerId ? -1 : 0}
        />
      </div>

      {isLoading ? (
        <div>
          <Spinner variant="primary" />
        </div>
      ) : validAddresses.length && !addNew ? (
        <div>
          <span className="inter-base-semibold">Choose existing addresses</span>
          <Controller
            control={form.control}
            name="shipping_address_id"
            render={({ field: { value, onChange } }) => {
              return (
                <RadioGroup.Root
                  className="mt-4"
                  value={value}
                  onValueChange={(id) => {
                    onChange(id)
                    onSelectExistingAddress(id)
                  }}
                >
                  {validAddresses.map((sa, i) => (
                    <RadioGroup.Item
                      label={`${sa.first_name} ${sa.last_name}`}
                      checked={!!value && sa.id === value}
                      description={`${sa.address_1}, ${sa.address_2} ${
                        sa.postal_code
                      } ${sa.city} ${sa.country_code?.toUpperCase()}`}
                      value={sa.id}
                      key={i}
                    ></RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              )
            }}
          />
          <div className="mt-4 flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              className="border border-grey-20 w-[112px]"
              onClick={onCreateNew}
            >
              Create new
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <AddressForm
            form={nestedForm(form, "shipping_address")}
            countryOptions={validCountries}
            type={AddressType.SHIPPING}
            required={requiredFields}
          />
        </div>
      )}
    </div>
  )
}

export default ShippingDetails
