import { storiesOf } from "@storybook/react"
import React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import ExperimentalSelect from "."
import useToggleState from "../../../../../hooks/use-toggle-state"
import { countries } from "../../../../../utils/countries"
import Button from "../../../../fundamentals/button"
import Modal from "../../../modal"

type SelectOption = {
  value: string
  label: string
  isDisabled?: boolean
  isFixed?: boolean
}

const options: SelectOption[] = [
  {
    value: "1",
    label: "Americas",
    isDisabled: true,
  },
  {
    value: "2",
    label: "Europe",
    isFixed: true,
  },
  {
    value: "3",
    label: "Asia",
  },
  {
    value: "4",
    label: "Africa",
  },
  {
    value: "5",
    label: "Oceania",
  },
  {
    value: "6",
    label: "Antarctica",
  },
  {
    value: "7",
    label: "North America",
  },
  {
    value: "8",
    label: "South America",
  },
  {
    value: "9",
    label: "Central America",
  },
  {
    value: "10",
    label: "Caribbean",
  },
  {
    value: "11",
    label: "Middle East",
  },
]

const countryOptions = countries.map((c) => ({
  label: c.name,
  value: c.alpha2,
}))

storiesOf("Molecules/Select/Next/Select", module).add(
  "Controlled Single Select",
  () => {
    const form = useForm<{
      options: SelectOption[]
    }>({ defaultValues: { options: [] } })

    const liveData = useWatch({
      control: form.control,
      name: "options",
    })

    return (
      <div>
        <Controller
          control={form.control}
          name="options"
          render={({ field: { value, onChange } }) => {
            return (
              <ExperimentalSelect
                label="Region"
                required
                options={options}
                value={value}
                onChange={onChange}
              />
            )
          }}
        />

        <div className="bg-grey-5 rounded-rounded px-small py-xsmall mt-xlarge mono-small-regular text-grey-50">
          <h1 className="inter-base-semibold mb-small">Data</h1>
          <pre>{JSON.stringify(liveData, null, 4)}</pre>
        </div>
      </div>
    )
  }
)

storiesOf("Molecules/Select/Next/Select", module).add(
  "Controlled Multi Select",
  () => {
    const form = useForm<{
      options: SelectOption[]
    }>({ defaultValues: { options: [] } })

    const liveData = useWatch({
      control: form.control,
      name: "options",
    })

    return (
      <div>
        <Controller
          control={form.control}
          name="options"
          render={({ field: { value, onChange } }) => {
            return (
              <ExperimentalSelect
                label="Regions"
                required
                options={countryOptions}
                value={value}
                onChange={onChange}
                isMulti
                selectAll
              />
            )
          }}
        />

        <div className="bg-grey-5 rounded-rounded px-small py-xsmall mt-xlarge mono-small-regular text-grey-50">
          <h1 className="inter-base-semibold mb-small">Data</h1>
          <pre>{JSON.stringify(liveData, null, 4)}</pre>
        </div>
      </div>
    )
  }
)

storiesOf("Molecules/Select/Next/Select", module).add("Small Select", () => {
  const form = useForm<{
    options: SelectOption[]
  }>({ defaultValues: { options: [] } })

  return (
    <div>
      <Controller
        control={form.control}
        name="options"
        render={({ field: { value, onChange } }) => {
          return (
            <ExperimentalSelect
              label="Region"
              required
              options={options}
              value={value}
              onChange={onChange}
              size="sm"
            />
          )
        }}
      />
    </div>
  )
})

storiesOf("Molecules/Select/Next/Select", module).add("Loading Select", () => {
  const form = useForm<{
    options: SelectOption[]
  }>({ defaultValues: { options: [] } })

  return (
    <div>
      <Controller
        control={form.control}
        name="options"
        render={({ field: { value, onChange } }) => {
          return (
            <ExperimentalSelect
              label="Region"
              required
              value={value}
              onChange={onChange}
              isLoading={true}
            />
          )
        }}
      />
    </div>
  )
})

storiesOf("Molecules/Select/Next/Select", module).add("In Modal", () => {
  const form = useForm<{
    options: SelectOption[]
  }>({ defaultValues: { options: [] } })

  const liveData = useWatch({
    control: form.control,
    name: "options",
  })

  const { toggle, state } = useToggleState()

  return (
    <>
      <div>
        <Button variant="primary" size="small" onClick={toggle}>
          Toggle modal
        </Button>
        <div className="bg-grey-5 rounded-rounded px-small py-xsmall mt-xlarge mono-small-regular text-grey-50">
          <h1 className="inter-base-semibold mb-small">Data</h1>
          <pre>{JSON.stringify(liveData, null, 4)}</pre>
        </div>
      </div>

      <Modal open={state} handleClose={toggle}>
        <Modal.Body>
          <Modal.Header handleClose={toggle}>
            <h1 className="inter-xlarge-semibold">Update Default Region</h1>
          </Modal.Header>
          <Modal.Content>
            <Controller
              control={form.control}
              name="options"
              render={({ field: { value, onChange } }) => {
                return (
                  <ExperimentalSelect
                    label="Region"
                    required
                    options={options}
                    value={value}
                    onChange={onChange}
                    isMulti
                    menuPortalTarget={document.body}
                  />
                )
              }}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex items-center justify-end gap-x-xsmall">
              <Button variant="secondary" size="small" onClick={toggle}>
                Cancel
              </Button>
              <Button variant="primary" size="small" onClick={toggle}>
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
})
