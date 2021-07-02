import React, { useState } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"

import TabItem from "./tab-item"

const TabButton = styled.button`
  ${({ active }) =>
    active &&
    `
border-bottom: 2px solid black !important;
`}
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 30px;
  font-size: 16px;
  margin-right: 10px;
`

const BUTTONS_DATA = [
  { buttonTitle: "Overview", value: "overview" },
  { buttonTitle: "Tutorials", value: "tutorial" },
  { buttonTitle: "Guides", value: "guide" },
  { buttonTitle: "Reference", value: "reference" },
  { buttonTitle: "Contributing", value: "contributing" },
]

const TabsPanel = ({ items }) => {
  const [sort, setSort] = useState("overview")

  const buttons = BUTTONS_DATA.map(item => (
    <TabButton onClick={() => setSort(item.value)} active={sort === item.value}>
      {item.buttonTitle}
    </TabButton>
  ))

  const getSortedArray = () => {
    if (sort === "overview") return items
    return items.filter(entry => entry.type === sort)
  }

  const renderTabItems = () =>
    getSortedArray().length > 0 ? (
      getSortedArray().map(item => {
        return <TabItem title={item.title} />
      })
    ) : (
      <p>hold tight! we are building these things</p>
    )

  return (
    <Box sx={{ maxWidth: "867px", marginBottom: "100px" }}>
      <Box sx={{ borderBottom: "1px solid black", marginBottom: "50px" }}>
        {buttons}
      </Box>
      <Flex justifyContent="space-between">{renderTabItems()}</Flex>
    </Box>
  )
}

export default TabsPanel
