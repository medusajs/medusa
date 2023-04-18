import { InputHeaderProps } from "../../fundamentals/input-header"

export type DateTimePickerProps = {
  date: Date | null
  onSubmitDate: (newDate: Date | null) => void
} & InputHeaderProps
