import { FC, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import Button from "../../../../../../../../../../components/fundamentals/button"
import LinkIcon from "../../../../../../../../../../components/fundamentals/icons/link"
import UnlinkIcon from "../../../../../../../../../../components/fundamentals/icons/unlink"
import Input from "../../../../../../../../../../components/molecules/input"

export interface SpacingInputGroupProps {
  name: string
  direction: "vertical" | "horizontal"
}

export const SpacingInputGroup: FC<SpacingInputGroupProps> = ({
  name,
  direction,
}) => {
  const [linked, setLinked] = useState(true)
  const { register, setValue, getValues, formState } = useFormContext()

  const isHorizontal = direction === "horizontal"
  const inputOne = {
    name: `${name}.${isHorizontal ? "left" : "top"}`,
    label: isHorizontal ? "Left" : "Top",
  }
  const inputTwo = {
    name: `${name}.${isHorizontal ? "right" : "bottom"}`,
    label: isHorizontal ? "Right" : "Bottom",
  }

  useEffect(() => {
    const inputOneValue = getValues(inputOne.name)
    const inputTwoValue = getValues(inputTwo.name)

    if (inputOneValue !== inputTwoValue) setLinked(false)
  }, [formState.defaultValues])

  return (
    <div className="flex justify-center items-end gap-4">
      <div className="flex-1">
        <Input
          type="number"
          label={inputOne.label}
          placeholder="Default"
          {...register(inputOne.name, {
            onChange: (e) => {
              if (linked)
                setValue(inputTwo.name, e.target.value, {
                  shouldDirty: true,
                })
            },
          })}
        />
      </div>

      <div className="flex-1">
        <Input
          type="number"
          label={inputTwo.label}
          placeholder="Default"
          {...register(inputTwo.name, {
            onChange: (e) => {
              if (linked)
                setValue(inputOne.name, e.target.value, {
                  shouldDirty: true,
                })
            },
          })}
        />
      </div>

      <div className="shrink-0 grow-0 py-1">
        <Button
          variant="ghost"
          className="w-6 h-6 p-0 text-grey-50"
          onClick={() => setLinked(!linked)}
        >
          {linked ? <LinkIcon /> : <UnlinkIcon />}
        </Button>
      </div>
    </div>
  )
}
