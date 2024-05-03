import { IUserModuleService } from "@medusajs/types/dist/user"
import { MockEventBusService } from "medusa-test-utils"
import { Modules } from "@medusajs/modules-sdk"
import { UserEvents } from "@medusajs/utils"
import { createUsers } from "../../../__fixtures__/user"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)

const defaultUserData = [
  {
    id: "1",
    email: "user_1@test.com",
  },
  {
    id: "2",
    email: "user_2@test.com",
  },
]

moduleIntegrationTestRunner({
  moduleName: Modules.USER,
  moduleOptions: {
    jwt_secret: "test",
  },
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({
    MikroOrmWrapper,
    service,
    medusaApp,
  }: SuiteOptions<IUserModuleService>) => {
    describe("UserModuleService - User", () => {
      afterEach(async () => {
        jest.clearAllMocks()
      })

      describe("list", () => {
        it("should list users", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)

          const users = await service.list()

          expect(users).toEqual([
            expect.objectContaining({
              id: "1",
            }),
            expect.objectContaining({
              id: "2",
            }),
          ])
        })

        it("should list users by id", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)
          const users = await service.list({
            id: ["1"],
          })

          expect(users).toEqual([
            expect.objectContaining({
              id: "1",
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        it("should list and count users", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)
          const [users, count] = await service.listAndCount()

          expect(count).toEqual(2)
          expect(users).toEqual([
            expect.objectContaining({
              id: "1",
            }),
            expect.objectContaining({
              id: "2",
            }),
          ])
        })

        it("should list and count users by id", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)
          const [Users, count] = await service.listAndCount({
            id: "1",
          })

          expect(count).toEqual(1)
          expect(Users).toEqual([
            expect.objectContaining({
              id: "1",
            }),
          ])
        })
      })

      describe("retrieve", () => {
        const id = "1"

        it("should return an user for the given id", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)

          const user = await service.retrieve(id)

          expect(user).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when an user with the given id does not exist", async () => {
          const error = await service.retrieve("does-not-exist").catch((e) => e)

          expect(error.message).toEqual(
            "User with id: does-not-exist was not found"
          )
        })

        it("should throw an error when a userId is not provided", async () => {
          const error = await service
            .retrieve(undefined as unknown as string)
            .catch((e) => e)

          expect(error.message).toEqual("user - id must be defined")
        })

        it("should return user based on config select param", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)

          const User = await service.retrieve(id, {
            select: ["id"],
          })

          const serialized = JSON.parse(JSON.stringify(User))

          expect(serialized).toEqual({
            id,
          })
        })
      })

      describe("delete", () => {
        const id = "1"

        it("should delete the users given an id successfully", async () => {
          await createUsers(MikroOrmWrapper.forkManager(), defaultUserData)

          await service.delete([id])

          const users = await service.list({
            id: [id],
          })

          expect(users).toHaveLength(0)
        })
      })

      describe("update", () => {
        it("should throw an error when a id does not exist", async () => {
          const error = await service
            .update([
              {
                id: "does-not-exist",
              },
            ])
            .catch((e) => e)

          expect(error.message).toEqual(
            'User with id "does-not-exist" not found'
          )
        })

        it("should emit user created events", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.create(defaultUserData)

          jest.clearAllMocks()

          await service.update([
            {
              id: "1",
              first_name: "John",
            },
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            expect.objectContaining({
              body: expect.objectContaining({
                data: { id: "1" },
              }),
              eventName: UserEvents.updated,
            }),
          ])
        })
      })

      describe("create", () => {
        it("should create a user successfully", async () => {
          await service.create(defaultUserData)

          const [User, count] = await service.listAndCount({
            id: ["1"],
          })

          expect(count).toEqual(1)
          expect(User[0]).toEqual(
            expect.objectContaining({
              id: "1",
            })
          )
        })

        it("should emit user created events", async () => {
          const eventBusSpy = jest.spyOn(MockEventBusService.prototype, "emit")
          await service.create(defaultUserData)

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            expect.objectContaining({
              body: expect.objectContaining({
                data: { id: "1" },
              }),
              eventName: UserEvents.created,
            }),
            expect.objectContaining({
              body: expect.objectContaining({
                data: { id: "2" },
              }),
              eventName: UserEvents.created,
            }),
          ])
        })
      })
    })
  },
})
