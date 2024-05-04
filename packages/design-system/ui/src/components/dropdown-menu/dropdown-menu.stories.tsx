import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { IconButton } from "@/components/icon-button"
import { Select } from "@/components/select"

import { DatePicker } from "../date-picker"
import { FocusModal } from "../focus-modal"
import { DropdownMenu } from "./dropdown-menu"

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

type SortingState = "asc" | "desc" | "alpha" | "alpha-reverse" | "none"

const SortingDemo = () => {
  const [sort, setSort] = React.useState<SortingState>("none")

  return (
    <div className="flex flex-col gap-y-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="primary">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[300px]">
          <DropdownMenu.RadioGroup
            value={sort}
            onValueChange={(v) => setSort(v as SortingState)}
          >
            <DropdownMenu.RadioItem value="none">
              No Sorting
            </DropdownMenu.RadioItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioItem value="alpha">
              Alphabetical
              <DropdownMenu.Hint>A-Z</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="alpha-reverse">
              Reverse Alphabetical
              <DropdownMenu.Hint>Z-A</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="asc">
              Created At - Ascending
              <DropdownMenu.Hint>1 - 30</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="desc">
              Created At - Descending
              <DropdownMenu.Hint>30 - 1</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
      <div>
        <pre>Sorting by: {sort}</pre>
      </div>
    </div>
  )
}

export const SortingMenu: Story = {
  render: () => {
    return <SortingDemo />
  },
}

const SelectDemo = () => {
  const [currencies, setCurrencies] = React.useState<string[]>([])
  const [regions, setRegions] = React.useState<string[]>([])

  const onSelectCurrency = (currency: string) => {
    if (currencies.includes(currency)) {
      setCurrencies(currencies.filter((c) => c !== currency))
    } else {
      setCurrencies([...currencies, currency])
    }
  }

  const onSelectRegion = (region: string) => {
    if (regions.includes(region)) {
      setRegions(regions.filter((r) => r !== region))
    } else {
      setRegions([...regions, region])
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[300px]">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Currencies</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem
              checked={currencies.includes("EUR")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectCurrency("EUR")
              }}
            >
              EUR
              <DropdownMenu.Hint>Euro</DropdownMenu.Hint>
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={currencies.includes("USD")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectCurrency("USD")
              }}
            >
              USD
              <DropdownMenu.Hint>US Dollar</DropdownMenu.Hint>
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={currencies.includes("DKK")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectCurrency("DKK")
              }}
            >
              DKK
              <DropdownMenu.Hint>Danish Krone</DropdownMenu.Hint>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Label>Regions</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem
              checked={regions.includes("NA")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectRegion("NA")
              }}
            >
              North America
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={regions.includes("EU")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectRegion("EU")
              }}
            >
              Europe
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem
              checked={regions.includes("DK")}
              onSelect={(e) => {
                e.preventDefault()
                onSelectRegion("DK")
              }}
            >
              Denmark
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
      <div>
        <pre>Currencies: {currencies.join(", ")}</pre>
        <pre>Regions: {regions.join(", ")}</pre>
      </div>
    </div>
  )
}

export const SelectMenu: Story = {
  render: () => {
    return <SelectDemo />
  },
}

export const SimpleMenu: Story = {
  render: () => {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item className="gap-x-2">
            <Plus className="text-ui-fg-subtle" />
            Add
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    )
  },
}

const ComplexMenuDemo = () => {
  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Open</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button>Save</Button>
        </FocusModal.Header>
        <FocusModal.Body className="item-center flex justify-center">
          <div>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button>View</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item className="gap-x-2">
                  <PencilSquare className="text-ui-fg-subtle" />
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item className="gap-x-2">
                  <Plus className="text-ui-fg-subtle" />
                  Add
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="gap-x-2">
                  <Trash className="text-ui-fg-subtle" />
                  Delete
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <div className="flex flex-col gap-y-2 p-2">
                  <Select>
                    <Select.Trigger>
                      <Select.Value placeholder="Select" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="1">One</Select.Item>
                      <Select.Item value="2">Two</Select.Item>
                      <Select.Item value="3">Three</Select.Item>
                    </Select.Content>
                  </Select>
                  <DatePicker />
                </div>
                <div className="border-ui-border-base flex items-center gap-x-2 border-t p-2">
                  <Button variant="secondary">Clear</Button>
                  <Button>Apply</Button>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export const ComplexMenu: Story = {
  render: () => {
    return <ComplexMenuDemo />
  },
}
