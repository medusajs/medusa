import { InputHeaderProps } from "../../fundamentals/input-header"

export type DateTimePickerProps = {
  date: Date
  onSubmitDate: (newDate: Date) => void
} & InputHeaderProps
