import { Server } from "http"
import { Socket } from "net"
import Timer = NodeJS.Timer

interface SocketState extends Socket {
  _idle: boolean
  _connectionId: number
}

export abstract class GracefulShutdownServer {
  public isShuttingDown: boolean
  public abstract shutdown(timeout?: number): Promise<void>
  public static create<T extends Server>(
    originalServer: T,
    waitingResponseTime: number = 200
  ): T & GracefulShutdownServer {
    let connectionId = 0
    let shutdownPromise: Promise<void>

    const allSockets: { [id: number]: SocketState } = {}

    const server = originalServer as T & GracefulShutdownServer
    server.isShuttingDown = false
    server.shutdown = async (timeout: number = 0): Promise<void> => {
      if (server.isShuttingDown) {
        return shutdownPromise
      }

      server.isShuttingDown = true

      shutdownPromise = new Promise((ok, nok) => {
        let forceQuit = false
        let cleanInterval: Timer

        try {
          // stop accepting new incoming connections
          server.close(() => {
            clearInterval(cleanInterval)
            ok()
          })

          if (+timeout > 0) {
            setTimeout(() => {
              forceQuit = true
            }, timeout).unref()
          }

          cleanInterval = setInterval(() => {
            if (!Object.keys(allSockets).length) {
              clearInterval(cleanInterval)
            }

            for (const key of Object.keys(allSockets)) {
              const socketId = +key
              if (forceQuit || allSockets[socketId]._idle) {
                allSockets[socketId].destroy()
                delete allSockets[socketId]
              }
            }
          }, waitingResponseTime)
        } catch (error) {
          clearInterval(cleanInterval!)
          return nok(error)
        }
      })

      return shutdownPromise
    }

    const onConnect = (originalSocket) => {
      connectionId++
      const socket = originalSocket as SocketState
      socket._idle = true
      socket._connectionId = connectionId
      allSockets[connectionId] = socket

      socket.on("close", () => {
        delete allSockets[socket._connectionId]
      })
    }

    server.on("connection", onConnect)
    server.on("secureConnection", onConnect)

    server.on("request", (req, res) => {
      const customSocket = req.socket as SocketState
      customSocket._idle = false

      res.on("finish", () => {
        customSocket._idle = true
      })
    })

    return server
  }
}
