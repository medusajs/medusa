import React from "react"
import styles from "./tab.module.css"

const TabItem = ({ title, isOverviewCard, items }) => {
  const overviewModeList = () =>
    items.map((item) => <p className="margin-bottom--xs">{item.title}</p>)
  return (
    <div className="col col--4 padding-right--md padding-bottom--md">
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h3>{title}</h3>
          <div>{isOverviewCard && overviewModeList()}</div>
        </div>
      </div>
    </div>
  )
}

export default TabItem
