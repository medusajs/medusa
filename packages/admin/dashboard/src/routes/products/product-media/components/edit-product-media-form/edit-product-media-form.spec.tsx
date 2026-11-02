import { HttpTypes } from "@medusajs/types"
import { ReactElement } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EditProductMediaForm } from "./edit-product-media-form"

const mocks = vi.hoisted(() => ({
  uploadCreate: vi.fn(),
  mutateAsync: vi.fn(),
  setError: vi.fn(),
}))

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useState: (initial: unknown) => [initial, vi.fn()],
  useCallback: (fn: unknown) => fn,
}))

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: unknown) => fn,
    setError: mocks.setError,
  }),
  useFieldArray: () => ({
    fields: [],
    append: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
  }),
}))

vi.mock("@dnd-kit/core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@dnd-kit/core")>()),
  useSensor: vi.fn(),
  useSensors: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", () => ({
  Button: vi.fn(),
  Checkbox: vi.fn(),
  clx: vi.fn(),
  CommandBar: Object.assign(vi.fn(), {
    Bar: vi.fn(),
    Value: vi.fn(),
    Seperator: vi.fn(),
    Command: vi.fn(),
  }),
  Tooltip: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock("../../../../../components/modals", () => ({
  RouteFocusModal: {
    Form: vi.fn(),
    Header: vi.fn(),
    Body: vi.fn(),
    Footer: vi.fn(),
    Close: vi.fn(),
  },
  useRouteModal: () => ({ handleSuccess: vi.fn() }),
}))

vi.mock("../../../../../components/utilities/keybound-form", () => ({
  KeyboundForm: vi.fn(),
}))

vi.mock("../../../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({
    mutateAsync: mocks.mutateAsync,
    isPending: false,
  }),
}))

vi.mock("../../../../../lib/client", () => ({
  sdk: {
    admin: {
      upload: { create: mocks.uploadCreate },
    },
  },
}))

vi.mock("../../../common/components/upload-media-form-item", () => ({
  UploadMediaFormItem: vi.fn(),
}))

const product = {
  id: "prod_1",
  thumbnail: "https://example.com/existing.png",
  images: [{ id: "img_1", url: "https://example.com/existing.png" }],
} as unknown as HttpTypes.AdminProduct

const media = [
  {
    id: "img_1",
    url: "https://example.com/existing.png",
    isThumbnail: true,
    file: null,
  },
  {
    id: "new_media",
    url: "blob:new-media",
    isThumbnail: false,
    file: new Blob(["<svg />"], { type: "image/svg+xml" }),
  },
]

const submit = async () => {
  const element = EditProductMediaForm({ product }) as ReactElement<{
    children: ReactElement<{
      onSubmit: (values: { media: typeof media }) => Promise<void>
    }>
  }>

  await element.props.children.props.onSubmit({ media })
}

describe("EditProductMediaForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should not update the product and should show the server's error when the upload fails", async () => {
    mocks.uploadCreate.mockRejectedValue(
      new Error("SVG files are not allowed.")
    )

    await submit()

    expect(mocks.uploadCreate).toHaveBeenCalledTimes(1)
    expect(mocks.setError).toHaveBeenCalledWith("media", {
      type: "invalid_file",
      message: "SVG files are not allowed.",
    })
    expect(mocks.mutateAsync).not.toHaveBeenCalled()
  })

  it("should update the product with the uploaded file's url when the upload succeeds", async () => {
    mocks.uploadCreate.mockResolvedValue({
      files: [{ id: "file_1", url: "https://example.com/uploaded.png" }],
    })

    await submit()

    expect(mocks.setError).not.toHaveBeenCalled()
    expect(mocks.mutateAsync).toHaveBeenCalledTimes(1)
    expect(mocks.mutateAsync.mock.calls[0][0]).toEqual({
      images: [
        { id: "img_1", url: "https://example.com/existing.png" },
        { id: "new_media", url: "https://example.com/uploaded.png" },
      ],
      thumbnail: "https://example.com/existing.png",
    })
  })
})
