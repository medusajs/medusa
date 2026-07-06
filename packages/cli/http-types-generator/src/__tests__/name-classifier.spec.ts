import { NameClassifier } from "../mapping/name-classifier"

describe("NameClassifier.classify", () => {
  describe("skip cases", () => {
    it("skips names without Admin or Store prefix", () => {
      expect(NameClassifier.classify("CreateProduct")).toBe("skip")
      expect(NameClassifier.classify("GetOrdersParams")).toBe("skip")
      expect(NameClassifier.classify("someHelper")).toBe("skip")
    })

    it("skips intermediate helper schemas ending with ParamsFields", () => {
      expect(NameClassifier.classify("AdminGetProductsParamsFields")).toBe("skip")
      expect(NameClassifier.classify("AdminCustomersParamsFields")).toBe("skip")
      expect(NameClassifier.classify("StoreGetProductsParamsFields")).toBe("skip")
    })

    it("skips schemas ending with ParamsDirectFields", () => {
      expect(
        NameClassifier.classify("AdminGetProductsParamsDirectFields")
      ).toBe("skip")
    })

    it("skips schemas ending with ParamsBase", () => {
      expect(NameClassifier.classify("AdminGetOrdersParamsBase")).toBe("skip")
    })

    it("skips schemas ending with ParamsTransform", () => {
      expect(NameClassifier.classify("AdminGetOrdersParamsTransform")).toBe(
        "skip"
      )
    })
  })

  describe("queries", () => {
    it("classifies *Params as queries", () => {
      expect(NameClassifier.classify("AdminGetProductsParams")).toBe("queries")
      expect(NameClassifier.classify("AdminCustomerFilters")).toBe("queries")
      expect(NameClassifier.classify("StoreGetOrdersParams")).toBe("queries")
      expect(NameClassifier.classify("AdminGetOrderParams")).toBe("queries")
    })

    it("classifies *Filters / *Filter as queries", () => {
      expect(NameClassifier.classify("AdminOrderFilters")).toBe("queries")
      expect(NameClassifier.classify("StoreRegionFilters")).toBe("queries")
      expect(NameClassifier.classify("AdminPaymentFilter")).toBe("queries")
    })

    it("classifies *ListParams as queries", () => {
      expect(NameClassifier.classify("AdminProductListParams")).toBe("queries")
      expect(NameClassifier.classify("StoreCollectionListParams")).toBe(
        "queries"
      )
    })

    it("classifies *FilterFields as queries", () => {
      expect(NameClassifier.classify("AdminOrderFilterFields")).toBe("queries")
    })
  })

  describe("payloads", () => {
    it("classifies Create* as payloads", () => {
      expect(NameClassifier.classify("AdminCreateProduct")).toBe("payloads")
      expect(NameClassifier.classify("StoreCreateCart")).toBe("payloads")
    })

    it("classifies Update* as payloads", () => {
      expect(NameClassifier.classify("AdminUpdateOrder")).toBe("payloads")
      expect(NameClassifier.classify("StoreUpdateCart")).toBe("payloads")
    })

    it("classifies Batch* as payloads", () => {
      expect(NameClassifier.classify("AdminBatchUpdateProducts")).toBe(
        "payloads"
      )
    })

    it("classifies Import* as payloads", () => {
      expect(NameClassifier.classify("AdminImportProducts")).toBe("payloads")
    })

    it("classifies Export* as payloads", () => {
      expect(NameClassifier.classify("AdminExportProducts")).toBe("payloads")
    })

    it("classifies *Request as payloads", () => {
      expect(NameClassifier.classify("AdminBatchProductRequest")).toBe(
        "payloads"
      )
    })

    it("classifies *Payload as payloads", () => {
      expect(NameClassifier.classify("AdminOrderPayload")).toBe("payloads")
    })

    it("classifies unrecognized Admin/Store names as payloads by default", () => {
      expect(NameClassifier.classify("AdminTransferOrder")).toBe("payloads")
      expect(NameClassifier.classify("AdminInviteAccept")).toBe("payloads")
      expect(NameClassifier.classify("StoreCompleteCart")).toBe("payloads")
    })
  })
})
