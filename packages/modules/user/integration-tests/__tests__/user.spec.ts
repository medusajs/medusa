import { IUserModuleService } from "@medusajs/types"
import { Module, Modules, UserEvents } from "@medusajs/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "medusa-test-utils"
import { UserModuleService } from "@services"

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

moduleIntegrationTestRunner<IUserModuleService>({
  moduleName: Modules.USER,
  moduleOptions: {
    jwt_secret: "test",
  },
  injectedDependencies: {
    eventBusModuleService: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    it.only(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.USER, {
        service: UserModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["invite", "user"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable).toEqual({
        invite: {
          id: {
            linkable: "invite_id",
            primaryKey: "id",
            serviceName: "user",
            field: "invite",
          },
        },
        user: {
          id: {
            linkable: "user_id",
            primaryKey: "id",
            serviceName: "user",
            field: "user",
          },
        },
      })
    })

    describe("UserModuleService - User", () => {
      afterEach(async () => {
        jest.clearAllMocks()
      })

      describe("list", () => {
        it("should list users", async () => {
          await service.createUsers(defaultUserData)
          const users = await service.listUsers()

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
          await service.createUsers(defaultUserData)
          const users = await service.listUsers({
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
          await service.createUsers(defaultUserData)
          const [users, count] = await service.listAndCountUsers()

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
          await service.createUsers(defaultUserData)
          const [Users, count] = await service.listAndCountUsers({
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
          await service.createUsers(defaultUserData)

          const user = await service.retrieveUser(id)

          expect(user).toEqual(
            expect.objectContaining({
              id,
            })
          )
        })

        it("should throw an error when an user with the given id does not exist", async () => {
          const error = await service
            .retrieveUser("does-not-exist")
            .catch((e) => e)

          expect(error.message).toEqual(
            "User with id: does-not-exist was not found"
          )
        })

        it("should throw an error when a userId is not provided", async () => {
          const error = await service
            .retrieveUser(undefined as unknown as string)
            .catch((e) => e)

          expect(error.message).toEqual("user - id must be defined")
        })

        it("should return user based on config select param", async () => {
          await service.createUsers(defaultUserData)

          const User = await service.retrieveUser(id, {
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
          await service.createUsers(defaultUserData)

          await service.deleteUsers([id])

          const users = await service.listUsers({
            id: [id],
          })

          expect(users).toHaveLength(0)
        })
      })

      describe("update", () => {
        it("should throw an error when a id does not exist", async () => {
          const error = await service
            .updateUsers([
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
          await service.createUsers(defaultUserData)

          jest.clearAllMocks()

          await service.updateUsers([
            {
              id: "1",
              first_name: "John",
            },
          ])

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            expect.objectContaining({
              data: { id: "1" },
              eventName: UserEvents.USER_UPDATED,
            }),
          ])
        })
      })

      describe("create", () => {
        it("should create a user successfully", async () => {
          await service.createUsers(defaultUserData)

          const [User, count] = await service.listAndCountUsers({
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
          await service.createUsers(defaultUserData)

          expect(eventBusSpy).toHaveBeenCalledTimes(1)
          expect(eventBusSpy).toHaveBeenCalledWith([
            expect.objectContaining({
              data: { id: "1" },
              eventName: UserEvents.USER_CREATED,
            }),
            expect.objectContaining({
              data: { id: "2" },
              eventName: UserEvents.USER_CREATED,
            }),
          ])
        })
      })
    })
  },
})
