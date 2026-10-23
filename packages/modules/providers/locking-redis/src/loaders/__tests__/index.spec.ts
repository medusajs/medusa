import { asValue, createContainer } from "@medusajs/framework/awilix"
import net from "node:net"
import { setTimeout } from "node:timers/promises"
import { RedisLockingProvider } from "../../services/redis-lock"
import loader from "../index"

describe("locking-redis loader", () => {
  let server: net.Server
  let port: number
  let openConnections = 0
  const sockets = new Set<net.Socket>()

  beforeAll(async () => {
    server = net.createServer((socket) => {
      openConnections++
      sockets.add(socket)
      socket.on("data", (data) => {
        const commands = (data.toString().match(/(^|\n)\*/g) || []).length
        socket.write("+OK\r\n".repeat(commands))
      })
      socket.on("close", () => openConnections--)
    })
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", () => resolve())
    )
    port = (server.address() as net.AddressInfo).port
  })

  afterAll(async () => {
    sockets.forEach((socket) => socket.destroy())
    await new Promise((resolve) => server.close(resolve))
  })

  const loadProvider = async () => {
    const container = createContainer()
    container.register({ logger: asValue(undefined) })

    await loader({
      container,
      options: {
        redisUrl: `redis://127.0.0.1:${port}`,
        redisOptions: { enableReadyCheck: false },
      },
    } as any)

    return new RedisLockingProvider(container.cradle as any, {} as any)
  }

  it("should close the Redis connection on shutdown", async () => {
    const initialConnections = openConnections
    const provider = await loadProvider()
    await provider.release("key", { ownerId: "owner" })
    expect(openConnections).toBe(initialConnections + 1)

    await provider.shutdown()
    await setTimeout(100)

    expect(openConnections).toBe(initialConnections)
  })
})
