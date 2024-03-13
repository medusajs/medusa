import { NextFunction, Request, Response } from "express"
import { transformQuery } from "../transform-query"
import { extendedFindParamsMixin } from "../../../types/common"

describe("transformQuery", () => {
  it("should transform the input query", async () => {
    let mockRequest = {
      query: {},
    } as Request
    const mockResponse = {} as Response
    const nextFunction: NextFunction = jest.fn()

    let queryConfig = {
      defaultFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
      ],
      isList: true,
    }

    let middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.validatedQuery).toEqual({
      offset: 0,
      limit: 20,
      order: undefined,
    })
    expect(mockRequest.filterableFields).toEqual({})
    expect(mockRequest.allowedProperties).toEqual([
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata.id",
      "metadata.parent.id",
      "metadata.children.id",
      "metadata.product.id",
      "metadata",
      "metadata.children",
      "metadata.parent",
      "metadata.product",
    ])
    expect(mockRequest.listConfig).toEqual({
      take: 20,
      skip: 0,
      select: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      relations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
      ],
      order: {
        created_at: "DESC",
      },
    })

    //////////////////////////////

    mockRequest = {
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as Request

    middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.validatedQuery).toEqual({
      offset: 5,
      limit: 10,
      order: "created_at",
    })
    expect(mockRequest.filterableFields).toEqual({})
    expect(mockRequest.allowedProperties).toEqual([
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata.id",
      "metadata.parent.id",
      "metadata.children.id",
      "metadata.product.id",
      "metadata",
      "metadata.children",
      "metadata.parent",
      "metadata.product",
    ])
    expect(mockRequest.listConfig).toEqual({
      skip: 5,
      take: 10,
      select: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      relations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
      ],
      order: {
        created_at: "ASC",
      },
    })
  })
})
