import { classifySchemaName } from "../mapping/name-classifier"

describe("classifySchemaName", () => {
  describe("skip cases", () => {
    it("skips names without Admin or Store prefix", () => {
      expect(classifySchemaName("CreateProduct")).toBe("skip")
      expect(classifySchemaName("GetOrdersParams")).toBe("skip")
      expect(classifySchemaName("someHelper")).toBe("skip")
    })

    it("skips intermediate helper schemas ending with ParamsFields", () => {
      expect(classifySchemaName("AdminGetProductsParamsFields")).toBe("skip")
      expect(classifySchemaName("AdminCustomersParamsFields")).toBe("skip")
      expect(classifySchemaName("StoreGetProductsParamsFields")).toBe("skip")
    })

    it("skips schemas ending with ParamsDirectFields", () => {
      expect(classifySchemaName("AdminGetProductsParamsDirectFields")).toBe(
        "skip"
      )
    })

    it("skips schemas ending with ParamsBase", () => {
      expect(classifySchemaName("AdminGetOrdersParamsBase")).toBe("skip")
    })

    it("skips schemas ending with ParamsTransform", () => {
      expect(classifySchemaName("AdminGetOrdersParamsTransform")).toBe("skip")
    })
  })

  describe("queries", () => {
    it("classifies *Params as queries", () => {
      expect(classifySchemaName("AdminGetProductsParams")).toBe("queries")
      expect(classifySchemaName("AdminCustomerFilters")).toBe("queries")
      expect(classifySchemaName("StoreGetOrdersParams")).toBe("queries")
      expect(classifySchemaName("AdminGetOrderParams")).toBe("queries")
    })

    it("classifies *Filters / *Filter as queries", () => {
      expect(classifySchemaName("AdminOrderFilters")).toBe("queries")
      expect(classifySchemaName("StoreRegionFilters")).toBe("queries")
      expect(classifySchemaName("AdminPaymentFilter")).toBe("queries")
    })

    it("classifies *ListParams as queries", () => {
      expect(classifySchemaName("AdminProductListParams")).toBe("queries")
      expect(classifySchemaName("StoreCollectionListParams")).toBe("queries")
    })

    it("classifies *FilterFields as queries", () => {
      expect(classifySchemaName("AdminOrderFilterFields")).toBe("queries")
    })
  })

  describe("payloads", () => {
    it("classifies Create* as payloads", () => {
      expect(classifySchemaName("AdminCreateProduct")).toBe("payloads")
      expect(classifySchemaName("StoreCreateCart")).toBe("payloads")
    })

    it("classifies Update* as payloads", () => {
      expect(classifySchemaName("AdminUpdateOrder")).toBe("payloads")
      expect(classifySchemaName("StoreUpdateCart")).toBe("payloads")
    })

    it("classifies Batch* as payloads", () => {
      expect(classifySchemaName("AdminBatchUpdateProducts")).toBe("payloads")
    })

    it("classifies Import* as payloads", () => {
      expect(classifySchemaName("AdminImportProducts")).toBe("payloads")
    })

    it("classifies Export* as payloads", () => {
      expect(classifySchemaName("AdminExportProducts")).toBe("payloads")
    })

    it("classifies *Request as payloads", () => {
      expect(classifySchemaName("AdminBatchProductRequest")).toBe("payloads")
    })

    it("classifies *Payload as payloads", () => {
      expect(classifySchemaName("AdminOrderPayload")).toBe("payloads")
    })

    it("classifies unrecognized Admin/Store names as payloads by default", () => {
      expect(classifySchemaName("AdminTransferOrder")).toBe("payloads")
      expect(classifySchemaName("AdminInviteAccept")).toBe("payloads")
      expect(classifySchemaName("StoreCompleteCart")).toBe("payloads")
    })
  })
})
