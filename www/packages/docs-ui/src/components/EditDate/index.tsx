import React from "react"

const DATE_REGEX = /^[a-zA-Z]+ (?<month>[a-zA-Z]+)/

type EditDateProps = {
  date: string
}

export const EditDate = ({ date }: EditDateProps) => {
  const today = new Date()
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return <></>
  }
  const formattedDate = dateObj.toString()
  const dateMatch = DATE_REGEX.exec(formattedDate)

  if (!dateMatch?.groups?.month) {
    return <></>
  }

  return (
    <>
      <span className="text-compact-small-plus" data-testid="edit-date">
        Edited {dateMatch.groups.month} {dateObj.getDate()}
        {dateObj.getFullYear() !== today.getFullYear()
          ? `, ${dateObj.getFullYear()}`
          : ""}
      </span>
      <span className="text-compact-small">&#183;</span>
    </>
  )
}
