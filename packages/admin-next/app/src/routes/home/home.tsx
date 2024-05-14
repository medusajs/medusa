import { Button, Container, Text } from "@medusajs/ui"
import { useState } from "react"

export const Home = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Container className="flex flex-col gap-y-2">
        <Text>
          Button was clicked <span className="tabular-nums">{counter}</span>{" "}
          times
        </Text>
        <Button size="small" onClick={() => setCounter(counter + 1)}>
          Click me
        </Button>
      </Container>
    </div>
  )
}
