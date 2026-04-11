import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"

import { SearchHitGroupName } from "../../GroupName"

describe("rendering", () => {
  test("renders group name", () => {
    const { container } = render(<SearchHitGroupName name="Test Group" />)
    const groupName = container.querySelector("span")
    expect(groupName).toBeInTheDocument()
    expect(groupName).toHaveTextContent("Test Group")
  })
})
