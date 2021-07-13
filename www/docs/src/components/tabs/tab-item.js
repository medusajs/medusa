import React from "react"
import { Card, Flex, Text } from "rebass"

const TabItem = ({ title, isOverviewCard, items }) => {
  const overviewModeList = () => items.map(item => <Text>{item.title}</Text>)
  return (
    <Flex sx={{ marginRight: "10px" }}>
      <Card
        mx="auto"
        sx={{
          backgroundColor: "#F0F0F0",
          width: "268px",
          height: "257px",
          borderRadius: "5px",
          padding: "20px 13px",
        }}
      >
        <Flex
          height="100%"
          justifyContent="space-between"
          flexDirection="column"
        >
          <Text>{title}</Text>
          <Flex flexDirection="column">
            {isOverviewCard && overviewModeList()}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}

export default TabItem
