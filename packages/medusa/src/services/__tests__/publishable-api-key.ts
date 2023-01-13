import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

import { EventBusService } from "../index"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import PublishableApiKeyService from "../publishable-api-key"

const pubKeyToRetrieve = {
  id: IdMap.getId("pub-key-to-retrieve"),
  created_at: new Date(),
  created_by: IdMap.getId("admin_user"),
  revoked_by: null,
  revoked_at: null,
}

describe("PublishableApiKeyService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const publishableApiKeyRepository = MockRepository({
    findOneWithRelations: (data) => ({ ...pubKeyToRetrieve, ...data }),
    create: (data) => {
      return {
        ...pubKeyToRetrieve,
        ...data,
      }
    },
  })

  const publishableApiKeySalesChannelRepository = MockRepository({})

  const publishableApiKeyService = new PublishableApiKeyService({
    manager: MockManager,
    publishableApiKeySalesChannelRepository:
      publishableApiKeySalesChannelRepository,
    publishableApiKeyRepository: publishableApiKeyRepository,
    eventBusService: EventBusServiceMock as unknown as EventBusService,
  })

  it("should retrieve a publishable api key and call the repository with the right arguments", async () => {
    await publishableApiKeyService.retrieve(
      IdMap.getId("order-edit-with-changes")
    )
    expect(
      publishableApiKeyRepository.findOneWithRelations
    ).toHaveBeenCalledTimes(1)
    expect(
      publishableApiKeyRepository.findOneWithRelations
    ).toHaveBeenCalledWith(undefined, {
      where: { id: IdMap.getId("order-edit-with-changes") },
    })
  })

  it("should create a publishable api key and call the repository with the right arguments as well as the event bus service", async () => {
    await publishableApiKeyService.create(
      { title: "API key title" },
      {
        loggedInUserId: IdMap.getId("admin_user"),
      }
    )

    expect(publishableApiKeyRepository.create).toHaveBeenCalledTimes(1)
    expect(publishableApiKeyRepository.create).toHaveBeenCalledWith({
      created_by: IdMap.getId("admin_user"),
      title: "API key title",
    })
    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      PublishableApiKeyService.Events.CREATED,
      { id: expect.any(String) }
    )
  })

  it("should update a publishable api key", async () => {
    await publishableApiKeyService.update(pubKeyToRetrieve.id, {
      title: "new title",
    })

    expect(publishableApiKeyRepository.save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        id: pubKeyToRetrieve.id,
        title: "new title",
      })
    )
  })

  it("should revoke a publishable api key", async () => {
    await publishableApiKeyService.revoke("id", {
      loggedInUserId: IdMap.getId("admin_user"),
    })

    expect(publishableApiKeyRepository.save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        revoked_by: IdMap.getId("admin_user"),
      })
    )

    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      PublishableApiKeyService.Events.REVOKED,
      { id: expect.any(String) }
    )
  })
})
