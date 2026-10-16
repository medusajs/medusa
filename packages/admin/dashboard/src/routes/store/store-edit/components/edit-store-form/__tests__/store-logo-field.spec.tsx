// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useForm, UseFormReturn } from "react-hook-form"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  const g = global as any
  g.__MAX_UPLOAD_FILE_SIZE__ = 1024
})

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

import { Form } from "../../../../../../components/common/form"
import { EditStoreSchemaType } from "../schema"
import { StoreLogoField } from "../store-logo-field"

let form: UseFormReturn<EditStoreSchemaType>

const Harness = ({ logo }: { logo: EditStoreSchemaType["logo"] }) => {
  form = useForm<EditStoreSchemaType>({
    defaultValues: { name: "ACME", logo },
  })

  return (
    <Form {...form}>
      <StoreLogoField form={form} />
    </Form>
  )
}

const pickFile = (file: File) => {
  const input = document.querySelector("input[type=file]") as HTMLInputElement

  fireEvent.change(input, { target: { files: [file] } })
}

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview")
})

afterEach(() => {
  cleanup()
})

describe("StoreLogoField", () => {
  it("shows the current logo and removes it", () => {
    render(<Harness logo={{ url: "https://example.com/logo.png" }} />)

    expect(screen.getByRole("img")).toHaveProperty(
      "src",
      "https://example.com/logo.png"
    )

    fireEvent.click(screen.getByRole("button", { name: "store.removeLogo" }))

    expect(form.getValues("logo")).toBeNull()
    expect(screen.queryByRole("img")).toBeNull()
    expect(screen.getByText("store.uploadLogoLabel")).toBeTruthy()
  })

  it("previews a picked image and keeps the file for upload", () => {
    render(<Harness logo={null} />)

    const file = new File(["logo"], "logo.png", { type: "image/png" })
    pickFile(file)

    expect(form.getValues("logo")).toEqual({ url: "blob:preview", file })
    expect(form.getFieldState("logo").isDirty).toBe(true)
    expect(screen.getByRole("img")).toHaveProperty("src", "blob:preview")
  })

  it("rejects a file that is not a supported image", () => {
    render(<Harness logo={null} />)

    pickFile(new File(["%PDF"], "logo.pdf", { type: "application/pdf" }))

    expect(form.getValues("logo")).toBeNull()
    expect(form.formState.errors.logo?.message).toBe(
      "store.logoInvalidFileType"
    )
    expect(screen.getByText("store.logoInvalidFileType")).toBeTruthy()
  })

  it("rejects a file above the maximum upload size", () => {
    render(<Harness logo={null} />)

    pickFile(new File(["x".repeat(2048)], "logo.png", { type: "image/png" }))

    expect(form.getValues("logo")).toBeNull()
    expect(form.formState.errors.logo?.message).toBe("store.logoFileTooLarge")
  })
})
