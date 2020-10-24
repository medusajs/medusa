import DocumentService from "../document"
import { DocumentModelMock } from "../../models/__mocks__/document"
import { IdMap } from "medusa-test-utils"

describe("DocumentService", () => {
  describe("retrieve", () => {
    const documentService = new DocumentService({
      documentModel: DocumentModelMock,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("retrieves a document", async () => {
      await documentService.retrieve(IdMap.getId("doc"))

      expect(DocumentModelMock.findOne).toHaveBeenCalledTimes(1)
      expect(DocumentModelMock.findOne).toHaveBeenCalledWith({
        _id: IdMap.getId("doc"),
      })
    })
  })
})
