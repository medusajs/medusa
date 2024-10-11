import React from "react"

const DATE_REGEX = /^[a-zA-Z]+ (?<month>[a-zA-Z]+)/

type MainNavEditDateProps = {
  date: string
}

export const MainNavEditDate = ({ date }: MainNavEditDateProps) => {
  const today = new Date(date)
  const dateObj = new Date(date)
  const formattedDate = dateObj.toString()
  const dateMatch = DATE_REGEX.exec(formattedDate)

  if (!dateMatch?.groups?.month) {
    return <></>
  }

  return (
    <>
      <span className="text-compact-small-plus">
        Edited {dateMatch.groups.month} {dateObj.getDate()}
        {dateObj.getFullYear() !== today.getFullYear()
          ? `, ${dateObj.getFullYear()}`
          : ""}
      </span>
      <span className="text-compact-small">&#183;</span>
    </>
  )
}
