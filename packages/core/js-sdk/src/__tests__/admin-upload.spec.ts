import { Client } from "../client"
import { Upload } from "../admin/upload"

describe("Admin upload", () => {
  let client: Client
  let upload: Upload
  let fetchSpy: jest.SpyInstance

  beforeEach(() => {
    client = new Client({ baseUrl: "https://someurl.com" })
    fetchSpy = jest
      .spyOn(client, "fetch")
      .mockResolvedValue({ files: [] } as any)
    upload = new Upload(client)
  })

  it("should upload files when FileList is not defined in the runtime", async () => {
    expect(typeof (globalThis as any).FileList).toEqual("undefined")

    const resp = await upload.create({
      files: [
        new File(["hello"], "hello.txt", { type: "text/plain" }),
        { name: "raw.txt", content: "raw content" },
      ],
    })

    expect(resp).toEqual({ files: [] })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [path, init] = fetchSpy.mock.calls[0]
    expect(path).toEqual("/admin/uploads")
    expect(init.method).toEqual("POST")
    expect(init.headers["content-type"]).toBeNull()

    const files = (init.body as FormData).getAll("files") as unknown as File[]
    expect(
      await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          content: await file.text(),
        }))
      )
    ).toEqual([
      { name: "hello.txt", content: "hello" },
      { name: "raw.txt", content: "raw content" },
    ])
  })
})
