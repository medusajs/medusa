import NoteService from "../note"
import { MockManager, MockRepository, IdMap } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("NoteService", () => {
  describe("listByResource", () => {
    const noteRepo = MockRepository({
      find: q => {
        return Promise.resolve([
          { id: IdMap.getId("note"), value: "some note" },
        ])
      },
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.listByResource(IdMap.getId("note"))
      expect(noteRepo.find).toHaveBeenCalledTimes(1)
      expect(noteRepo.find).toHaveBeenCalledWith({
        where: {
          resource_id: IdMap.getId("note"),
        },
        order: {
          created_at: "DESC",
        },
        skip: 0,
        take: 50,
      })
    })
  })

  describe("retrieve", () => {
    const noteRepo = MockRepository({
      findOne: q => {
        switch (q.where.id) {
          case IdMap.getId("note"):
            return Promise.resolve({
              id: IdMap.getId("note"),
              value: "some note",
            })
          default:
            return Promise.resolve()
        }
      },
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.retrieve(IdMap.getId("note"))
      expect(noteRepo.findOne).toHaveBeenCalledTimes(1)
      expect(noteRepo.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("note") },
      })
    })

    it("fails when note is not found", async () => {
      await expect(
        noteService.retrieve(IdMap.getId("not-existing"))
      ).rejects.toThrow(
        `Note with id: ${IdMap.getId("not-existing")} was not found.`
      )
    })
  })

  describe("create", () => {
    const note = { id: IdMap.getId("note") }

    const noteRepo = MockRepository({
      create: f => Promise.resolve(note),
      save: f => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.create(IdMap.getId("resource-id"), "type", "my note")

      expect(noteRepo.create).toHaveBeenCalledTimes(1)
      expect(noteRepo.create).toHaveBeenCalledWith({
        resource_id: IdMap.getId("resource-id"),
        resource_type: "type",
        value: "my note",
        metadata: {},
      })

      expect(noteRepo.save).toHaveBeenCalledTimes(1)
      expect(noteRepo.save).toHaveBeenCalledWith({
        id: IdMap.getId("note"),
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.CREATED,
        { id: IdMap.getId("note") }
      )
    })
  })

  describe("update", () => {
    const note = { id: IdMap.getId("note") }

    const noteRepo = MockRepository({
      findOne: f => Promise.resolve(note),
      save: f => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.update(IdMap.getId("note"), "new note")

      expect(noteRepo.findOne).toHaveBeenCalledTimes(1)
      expect(noteRepo.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("note") },
      })

      expect(noteRepo.save).toHaveBeenCalledTimes(1)
      expect(noteRepo.save).toHaveBeenCalledWith({
        ...note,
        value: "new note",
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.UPDATED,
        { id: IdMap.getId("note") }
      )
    })
  })

  describe("delete", () => {
    const note = { id: IdMap.getId("note") }

    const noteRepo = MockRepository({
      softRemove: f => Promise.resolve(),
      findOne: f => Promise.resolve(note),
    })

    const noteService = new NoteService({
      manager: MockManager,
      noteRepository: noteRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls note model functions", async () => {
      await noteService.delete(IdMap.getId("note"))

      expect(noteRepo.findOne).toHaveBeenCalledTimes(1)
      expect(noteRepo.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("note") },
      })

      expect(noteRepo.softRemove).toHaveBeenCalledTimes(1)
      expect(noteRepo.softRemove).toHaveBeenCalledWith(note)

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
        NoteService.Events.DELETED,
        { id: IdMap.getId("note") }
      )
    })
  })
})
