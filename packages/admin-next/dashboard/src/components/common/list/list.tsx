import { Checkbox, Text } from "@medusajs/ui"

export interface ListProps<T> {
  options: { title: string; value: T }[]
  value?: T[]
  onChange?: (value: T[]) => void
  compare?: (a: T, b: T) => boolean
  disabled?: boolean
}

export const List = <T extends any>({
  options,
  onChange,
  value,
  compare,
  disabled,
}: ListProps<T>) => {
  if (options.length === 0) {
    return null
  }

  return (
    <div className="flex-row justify-center divide-y rounded-lg border">
      {options.map((option) => {
        return (
          <div className="flex gap-x-4 p-4" key={option.title}>
            {onChange && value !== undefined && (
              <Checkbox
                disabled={disabled}
                checked={value.some(
                  (v) => compare?.(v, option.value) ?? v === option.value
                )}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...value, option.value])
                  } else {
                    onChange(
                      value.filter(
                        (v) =>
                          !(compare?.(v, option.value) ?? v === option.value)
                      )
                    )
                  }
                }}
              />
            )}

            <Text key={option.title}>{option.title}</Text>
          </div>
        )
      })}
    </div>
  )
}
