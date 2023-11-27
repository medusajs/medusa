import { Select } from "@medusajs/ui"

export default function SelectSmall() {
  return (
    <div className="w-[256px]">
      <Select size="small">
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]
