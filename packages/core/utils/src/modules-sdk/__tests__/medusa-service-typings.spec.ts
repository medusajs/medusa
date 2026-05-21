import { expectTypeOf } from "expect-type"
import { model } from "../../dml"
import { MedusaService } from "../medusa-service"
import { InferTypeOf } from "@medusajs/types"

const Blog = model.define("Blog", {
  id: model.text(),
  title: model.text(),
  tags: model.manyToMany(() => Tag),
  comments: model.hasMany(() => Comment),
  description: model.text().nullable(),
})

const Tag = model.define("Tag", {
  id: model.text(),
  title: model.text(),
})

const Comment = model.define("Comment", {
  id: model.text(),
  post: model.belongsTo(() => Blog),
  author: model.belongsTo(() => User),
  description: model.text().nullable(),
})

const User = model.define("User", {
  id: model.text(),
  username: model.text(),
})

const CountryCompanyInfo = model.define("CountryCompanyInfo", {
  id: model.text(),
})

type BlogDTO = {
  id: number
  title: string
}

type CountryCompanyInfoDTO = {
  id: string
}

type CreateBlogDTO = {
  title: string | null
}

const baseRepoMock = {
  serialize: jest.fn().mockImplementation((item) => item),
  transaction: (task) => task("transactionManager"),
  getFreshManager: jest.fn().mockReturnThis(),
}

const containerMock = {
  baseRepository: baseRepoMock,
  mainModelMockRepository: baseRepoMock,
  otherModelMock1Repository: baseRepoMock,
  otherModelMock2Repository: baseRepoMock,
  mainModelMockService: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
  otherModelMock1Service: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
  otherModelMock2Service: {
    retrieve: jest.fn().mockResolvedValue({ id: "1", name: "Item" }),
    list: jest.fn().mockResolvedValue([{ id: "1", name: "Item" }]),
    delete: jest.fn().mockResolvedValue(undefined),
    softDelete: jest.fn().mockResolvedValue([[], {}]),
    restore: jest.fn().mockResolvedValue([[], {}]),
  },
}

describe("Medusa Service typings", () => {
  test("pluralizes compound info model method names", () => {
    class CountryCompanyInfoService extends MedusaService<{
      CountryCompanyInfo: { dto: CountryCompanyInfoDTO }
    }>({ CountryCompanyInfo }) {}
    const countryCompanyInfoService = new CountryCompanyInfoService(
      containerMock
    )

    expectTypeOf(
      countryCompanyInfoService.listCountryCompanyInfos
    ).returns.toEqualTypeOf<Promise<CountryCompanyInfoDTO[]>>()

    // @ts-expect-error compound Info model names should match runtime plural method names
    countryCompanyInfoService.listCountryCompanyInfo
  })

  describe("create<Service>", () => {
    test("type-hint model properties", () => {
      class BlogService extends MedusaService({ Blog, Comment }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              comments: string[] | undefined
              tags: string[] | undefined
              description: string | null | undefined
            }>,
            ...rest: any[]
          ]
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              comments: string[] | undefined
              tags: string[] | undefined
              description: string | null | undefined
            }>[],
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<InferTypeOf<typeof Blog>> | Promise<InferTypeOf<typeof Blog>[]>
      >()

      expectTypeOf(blogService.createComments).parameters.toEqualTypeOf<
        | [
            Partial<{
              id: string | undefined
              post: string | undefined
              author: string | undefined
              post_id: string | undefined
              author_id: string | undefined
              description: string | null | undefined
            }>,
            ...rest: any[]
          ]
        | [
            Partial<{
              id: string | undefined
              post: string | undefined
              author: string | undefined
              post_id: string | undefined
              author_id: string | undefined
              description: string | null | undefined
            }>[],
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<InferTypeOf<typeof Blog>> | Promise<InferTypeOf<typeof Blog>[]>
      >()
    })

    test("type-hint DTO properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [Partial<BlogDTO>, ...rest: any[]]
        | [Partial<BlogDTO>[], ...rest: any[]]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })

    test("type-hint force overridden properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {
        // @ts-expect-error
        async createBlogs(_: CreateBlogDTO): Promise<BlogDTO> {
          return {} as BlogDTO
        }
      }
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        [CreateBlogDTO]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO>
      >()
    })

    test("define custom DTO for inputs", () => {
      class BlogService extends MedusaService<{
        Blog: { dto: BlogDTO; inputDto: Omit<BlogDTO, "id"> }
      }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.createBlogs).parameters.toEqualTypeOf<
        | [Partial<{ title: string | undefined }>, ...rest: any[]]
        | [Partial<{ title: string | undefined }>[], ...rest: any[]]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })
  })

  describe("update<Service>", () => {
    test("type-hint model properties", () => {
      class BlogService extends MedusaService({ Blog }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [
            Partial<{
              id: string | undefined
              title: string | undefined
              comments: string[] | undefined
              tags: string[] | undefined
              description: string | null | undefined
            }>,
            ...rest: any[]
          ]
        | [
            (
              | Partial<{
                  id: string | undefined
                  title: string | undefined
                  comments: string[] | undefined
                  tags: string[] | undefined
                  description: string | null | undefined
                }>[]
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        comments: string[] | undefined
                        tags: string[] | undefined
                        description: string | null | undefined
                      }>
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        comments: string[] | undefined
                        tags: string[] | undefined
                        description: string | null | undefined
                      }>[]
                }
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        comments: string[] | undefined
                        tags: string[] | undefined
                        description: string | null | undefined
                      }>
                    | Partial<{
                        id: string | undefined
                        title: string | undefined
                        comments: string[] | undefined
                        tags: string[] | undefined
                        description: string | null | undefined
                      }>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<InferTypeOf<typeof Blog>> | Promise<InferTypeOf<typeof Blog>[]>
      >()
    })

    test("type-hint DTO properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [Partial<BlogDTO>, ...rest: any[]]
        | [
            (
              | Partial<BlogDTO>[]
              | {
                  selector: Record<string, any>
                  data: Partial<BlogDTO> | Partial<BlogDTO>[]
                }
              | {
                  selector: Record<string, any>
                  data: Partial<BlogDTO> | Partial<BlogDTO>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })

    test("type-hint force overridden properties", () => {
      class BlogService extends MedusaService<{ Blog: { dto: BlogDTO } }>({
        Blog,
      }) {
        // @ts-expect-error
        async updateBlogs(_: string, __: CreateBlogDTO): Promise<BlogDTO> {
          return {} as BlogDTO
        }
      }
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        [id: string, data: CreateBlogDTO]
      >()
      expectTypeOf(blogService.updateBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO>
      >()
    })

    test("define custom DTO for inputs", () => {
      class BlogService extends MedusaService<{
        Blog: { dto: BlogDTO; inputDto: Omit<BlogDTO, "id"> }
      }>({
        Blog,
      }) {}
      const blogService = new BlogService(containerMock)

      expectTypeOf(blogService.updateBlogs).parameters.toEqualTypeOf<
        | [Partial<{ title: string | undefined }>, ...rest: any[]]
        | [
            (
              | Partial<{ title: string | undefined }>[]
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{ title: string | undefined }>
                    | Partial<{ title: string | undefined }>[]
                }
              | {
                  selector: Record<string, any>
                  data:
                    | Partial<{ title: string | undefined }>
                    | Partial<{ title: string | undefined }>[]
                }[]
            ),
            ...rest: any[]
          ]
      >()
      expectTypeOf(blogService.createBlogs).returns.toEqualTypeOf<
        Promise<BlogDTO> | Promise<BlogDTO[]>
      >()
    })
  })
})
