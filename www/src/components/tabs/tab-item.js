import React from "react"
import { Card, Flex, Text } from "rebass"

const TabItem = ({ title }) => {
  return (
    <Flex>
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
        <Text>{title}</Text>
      </Card>
    </Flex>
  )
}

export default TabItem
