import { parse } from "iso8601-duration"
import React, { useEffect, useState } from "react"
import InputField from "../input"

type AvailabilityDurationProps = {
  onChange: React.Dispatch<React.SetStateAction<string | undefined>>
  value: string | undefined
}

const getValue = (e: React.ChangeEvent<HTMLInputElement>) =>
  parseFloat(e.target.value)

const AvailabilityDuration: React.FC<AvailabilityDurationProps> = ({
  value,
  onChange,
}) => {
  const duration = value ? parse(value) : {}
  const [durationYears, setDurationYears] = useState(duration.years || 0)
  const [durationMonths, setDurationMonths] = useState(duration.months || 0)
  const [durationDays, setDurationDays] = useState(duration.days || 0)
  const [durationHours, setDurationHours] = useState(duration.hours || 0)
  const [durationMinutes, setDurationMinutes] = useState(duration.minutes || 0)

  useEffect(() => {
    const isoString = `P${durationYears || 0}Y${durationMonths || 0}M${
      durationDays || 0
    }DT${durationHours || 0}H${durationMinutes || 0}M`

    onChange(isoString)
  }, [
    durationYears,
    durationMonths,
    durationDays,
    durationHours,
    durationMinutes,
  ])

  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-2 gap-x-xsmall gap-y-base mt-xlarge">
        <InputField
          label="Years"
          type="number"
          placeholder="0"
          value={durationYears}
          onChange={(e) => setDurationYears(getValue(e))}
          min={0}
        />
        <InputField
          label="Months"
          type="number"
          placeholder="0"
          value={durationMonths}
          onChange={(e) => setDurationMonths(getValue(e))}
          min={0}
        />
        <InputField
          label="Days"
          type="number"
          placeholder="0"
          value={durationDays}
          onChange={(e) => setDurationDays(getValue(e))}
          min={0}
        />
        <InputField
          label="Hours"
          type="number"
          placeholder="0"
          value={durationHours}
          onChange={(e) => setDurationHours(getValue(e))}
          min={0}
        />
        <InputField
          label="Minutes"
          type="number"
          placeholder="0"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(getValue(e))}
          min={0}
        />
      </div>
    </div>
  )
}

export default AvailabilityDuration
