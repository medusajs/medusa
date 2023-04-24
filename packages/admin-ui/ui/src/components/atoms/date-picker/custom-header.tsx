import React from "react"
import NativeSelect from "../../molecules/native-select"
import { ReactDatePickerCustomHeaderProps } from "react-datepicker"
import { monthNames, getYearRange } from "./utils"

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
}: ReactDatePickerCustomHeaderProps) => {
  const month = date.getMonth()
  const monthName = monthNames[month]

  const year = date.getFullYear()
  return (
    <div className="flex w-full gap-4 items-center">
      <div className="flex flex-1 items-center justify-end gap-3">
        <NativeSelect
          defaultValue={monthName}
          onValueChange={(v) => changeMonth(monthNames.indexOf(v))}
        >
          {monthNames.map((month) => (
            <NativeSelect.Item key={month} value={month}>
              {month}
            </NativeSelect.Item>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-1 items-center justify-start gap-3">
        <NativeSelect
          defaultValue={year.toString()}
          onValueChange={(v) => changeYear(parseInt(v, 10))}
        >
          {getYearRange().map((year) => (
            <NativeSelect.Item key={year} value={year.toString()}>
              {year.toString()}
            </NativeSelect.Item>
          ))}
        </NativeSelect>
      </div>
    </div>
  )
}

export default CustomHeader
