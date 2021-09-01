import clsx from "clsx"
import React, { useState } from "react"
import { TabItem } from "./TabItem/"

const BUTTONS_DATA = [
  { buttonTitle: "Overview", value: "overview" },
  { buttonTitle: "Tutorial", value: "tutorial" },
  { buttonTitle: "Guides", value: "guide" },
  { buttonTitle: "Reference", value: "reference" },
]

const OVERVIEW_DATA = ["Tutorial", "Guides", "Reference"]

const TabsPanel = ({ items }) => {
  const [sort, setSort] = useState("overview")

  const buttons = BUTTONS_DATA.map((item) => (
    // <button
    //   className={clsx(
    //     { [styles.buttonActive]: sort === item.value },
    //     styles.button
    //   )}
    //   onClick={() => setSort(item.value)}
    // >
    //   {item.buttonTitle}
    // </button>
    <li
      className={clsx("tabs__item", {
        "tabs__item--active": sort === item.value,
      })}
      onClick={() => setSort(item.value)}
    >
      {item.buttonTitle}
    </li>
  ))

  const getOverviewCardItemsSet = (currentCard) =>
    items.filter((item) => item.key === currentCard.toLowerCase())

  const overviewCardsSet = () =>
    OVERVIEW_DATA.map((item) => (
      <TabItem
        isOverviewCard
        title={item}
        items={getOverviewCardItemsSet(item)}
      />
    ))

  const getSortedArray = () => {
    return items.filter((entry) => entry.type === sort)
  }

  const renderTabItems = () => {
    if (sort === "overview") return overviewCardsSet()
    return getSortedArray().length > 0 ? (
      getSortedArray().map((item) => {
        return <TabItem title={item.title} />
      })
    ) : (
      <p>hold tight! we are building these things</p>
    )
  }

  return (
    <div className="padding-bottom--xl">
      {/* <Box sx={{ borderBottom: "1px solid black", marginBottom: "50px" }}>
        {buttons}
      </Box> */}
      <ul class="tabs margin-bottom--lg">{buttons}</ul>
      <div className="container padding--none">
        <div className="row row--no-gutters">{renderTabItems()}</div>
      </div>
    </div>
  )
}

export default TabsPanel
