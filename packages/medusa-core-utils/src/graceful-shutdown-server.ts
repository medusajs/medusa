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
    server: T & GracefulShutdownServer,
    waitingResponseTime: number = 300
  ): T & GracefulShutdownServer {
    let connectionId = 0
    let shutdownPromise: Promise<void>

    const allSockets: { [id: number]: SocketState } = {}

    server.isShuttingDown = false
    server.shutdown = async (timeout: number = 0): Promise<void> => {
      if (server.isShuttingDown) {
        return shutdownPromise
      }

      server.isShuttingDown = true

      shutdownPromise = new Promise((ok, nok) => {
        let forceQuit = false
        let forceTimeout: Timer
        let cleanInterval: Timer

        function clearTimeouts() {
          clearTimeout(forceTimeout)
          clearInterval(cleanInterval)
        }

        try {
          server.close(() => {
            clearTimeouts()
            ok()
          })

          if (+timeout > 0) {
            forceTimeout = setTimeout(() => {
              forceQuit = true
            }, timeout)
          }

          cleanInterval = setInterval(() => {
            for (const key of Object.keys(allSockets)) {
              const socketId = +key
              if (forceQuit || allSockets[socketId]._idle) {
                allSockets[socketId].destroy()
                delete allSockets[socketId]
              }
            }
          }, waitingResponseTime)
        } catch (error) {
          clearTimeouts()
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
