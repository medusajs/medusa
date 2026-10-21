import { INoteModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

moduleIntegrationTestRunner<INoteModuleService>({
  moduleName: Modules.NOTE,
  testSuite: ({ service }) => {
    describe("NoteModuleService", () => {
      it("creates a note and retrieves it by resource_type and resource_id", async () => {
        const note = await service.createNotes({
          resource_type: "order",
          resource_id: "order_123",
          value: "Called customer",
          author_id: "user_123",
        })

        expect(note.value).toEqual("Called customer")

        const notes = await service.listNotes({
          resource_type: "order",
          resource_id: ["order_123"],
        })

        expect(notes).toHaveLength(1)
      })

      it("excludes a deleted note from subsequent listNotes calls", async () => {
        const note = await service.createNotes({
          resource_type: "customer",
          resource_id: "cus_123",
          value: "VIP",
          author_id: "user_123",
        })

        await service.deleteNotes(note.id)

        const notes = await service.listNotes({ resource_id: ["cus_123"] })
        expect(notes).toHaveLength(0)
      })
    })
  },
})
