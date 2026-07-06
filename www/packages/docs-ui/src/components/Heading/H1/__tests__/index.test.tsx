import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"
import { H1 } from "../index"

describe("render", () => {
  test("renders h1 with children text", () => {
    const { container } = render(<H1>Hello World</H1>)
    const h1 = container.querySelector("h1")
    expect(h1).toBeInTheDocument()
    expect(h1).toHaveTextContent("Hello World")
  })

  test("does not render ShadedBlock with default variant", () => {
    const { container } = render(<H1>Title</H1>)
    const shadedBlock = container.querySelector(".bg-bg-stripes")
    expect(shadedBlock).not.toBeInTheDocument()
  })

  test("does not render ShadedBlock when variant is default", () => {
    const { container } = render(<H1 variant="default">Title</H1>)
    const shadedBlock = container.querySelector(".bg-bg-stripes")
    expect(shadedBlock).not.toBeInTheDocument()
  })

  test("renders ShadedBlock when variant is content", () => {
    const { container } = render(<H1 variant="content">Title</H1>)
    const shadedBlock = container.querySelector(".bg-bg-stripes")
    expect(shadedBlock).toBeInTheDocument()
  })

  test("applies scroll class when id is provided", () => {
    const { container } = render(<H1 id="my-heading">Title</H1>)
    const h1 = container.querySelector("h1")
    expect(h1).toHaveClass("scroll-m-docs_7")
  })

  test("does not apply scroll class when id is not provided", () => {
    const { container } = render(<H1>Title</H1>)
    const h1 = container.querySelector("h1")
    expect(h1).not.toHaveClass("scroll-m-docs_7")
  })

  test("applies custom className to h1", () => {
    const { container } = render(<H1 className="custom-class">Title</H1>)
    const h1 = container.querySelector("h1")
    expect(h1).toHaveClass("custom-class")
  })

  test("wrapper always has h1-wrapper class", () => {
    const { container } = render(<H1>Title</H1>)
    const wrapper = container.querySelector(".h1-wrapper")
    expect(wrapper).toBeInTheDocument()
  })
})
