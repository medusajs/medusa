import { GracefulShutdownServer } from "../graceful-shutdown-server"

describe("GracefulShutdownServer", () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })
  afterEach(() => {})

  it('should add "isShuttingDown" property to the existing server', () => {
    const server = GracefulShutdownServer.create({ on: jest.fn() } as any)
    expect(server).toHaveProperty("isShuttingDown")
    expect(server.isShuttingDown).toEqual(false)
  })

  it("should listen for client connections and store reference to them", async () => {
    const onEventMock = jest.fn()

    GracefulShutdownServer.create({ on: onEventMock } as any)

    expect(onEventMock).toBeCalledTimes(3)

    expect(onEventMock.mock.calls[2][0]).toEqual("request")

    const connectEvent: (socket) => any = onEventMock.mock.calls[0][1]

    const onSocketClose = jest.fn()
    const socket = { on: onSocketClose }
    connectEvent(socket)
    expect(socket).toEqual(
      expect.objectContaining({
        _idle: true,
        _connectionId: 1,
      })
    )

    const socket2 = { on: onSocketClose }
    connectEvent(socket2)
    expect(socket2).toEqual(
      expect.objectContaining({
        _idle: true,
        _connectionId: 2,
      })
    )

    const requestMock = onEventMock.mock.calls[2][1]
    expect(typeof requestMock).toEqual("function")

    const socket3 = { on: onSocketClose }
    const req = { socket: socket3, on: jest.fn() }
    const res = { on: jest.fn() }
    connectEvent(socket3)
    requestMock(req, res)

    const finishRequestMock = res.on.mock.calls[0][1]

    expect(socket3).toEqual(
      expect.objectContaining({
        _idle: false,
        _connectionId: 3,
      })
    )
    finishRequestMock()
    expect(socket3).toEqual(
      expect.objectContaining({
        _idle: true,
        _connectionId: 3,
      })
    )

    expect(onSocketClose).toBeCalledTimes(3)
    expect(onSocketClose.mock.calls[0][0]).toEqual("close")
  })

  it("waits requests to complete before shutting the server down", (done: Function) => {
    jest.useFakeTimers()

    const onEventMock = jest.fn()
    const setIntervalSpy = jest.spyOn(global, "setInterval")
    const setTimeoutSpy = jest.spyOn(global, "setTimeout")
    const clearIntervalSpy = jest.spyOn(global, "clearInterval")

    const waitTime = 200
    let closeServerCallback: Function
    const server = GracefulShutdownServer.create(
      {
        close: (callback) => {
          closeServerCallback = callback
        },
        on: onEventMock,
      } as any,
      waitTime
    )

    const requestMock = onEventMock.mock.calls[2][1]
    const connectEvent: (socket) => any = onEventMock.mock.calls[0][1]

    expect(typeof requestMock).toEqual("function")

    const socket = { on: jest.fn(), destroy: jest.fn() }
    const req = { socket, on: jest.fn() }
    const res = { on: jest.fn() }
    connectEvent(socket)

    requestMock(req, res)

    const finishRequestMock = res.on.mock.calls[0][1]

    server.shutdown().then(() => {
      done()
    })

    expect(setTimeoutSpy).toBeCalledTimes(0)
    expect(setIntervalSpy).toBeCalledTimes(1)
    expect(setIntervalSpy.mock.calls[0][1]).toEqual(waitTime)
    expect(clearIntervalSpy).toBeCalledTimes(0)
    expect(socket.destroy).toBeCalledTimes(0)

    jest.advanceTimersByTime(200)

    expect(socket.destroy).toBeCalledTimes(0)

    finishRequestMock()

    expect(socket.destroy).toBeCalledTimes(0)

    jest.advanceTimersByTime(waitTime)

    expect(socket.destroy).toBeCalledTimes(1)

    closeServerCallback!()
  })

  it("should force close all connections after the timeout is reached", (done: Function) => {
    jest.useFakeTimers()

    const onEventMock = jest.fn()
    const setIntervalSpy = jest.spyOn(global, "setInterval")
    const setTimeoutSpy = jest.spyOn(global, "setTimeout")
    const clearIntervalSpy = jest.spyOn(global, "clearInterval")

    const waitTime = 300
    let closeServerCallback: Function
    const server = GracefulShutdownServer.create(
      {
        close: (callback) => {
          closeServerCallback = callback
        },
        on: onEventMock,
      } as any,
      waitTime
    )

    const requestMock = onEventMock.mock.calls[2][1]
    const connectEvent: (socket) => any = onEventMock.mock.calls[0][1]

    expect(typeof requestMock).toEqual("function")

    const socket = { on: jest.fn(), destroy: jest.fn() }
    const req = { socket, on: jest.fn() }
    const res = { on: jest.fn() }
    connectEvent(socket)

    requestMock(req, res) // pending request

    const forceTimeout = 600
    server.shutdown(forceTimeout).then(() => {
      done()
    })

    expect(setTimeoutSpy).toBeCalledTimes(1)
    expect(setTimeoutSpy.mock.calls[0][1]).toEqual(forceTimeout)
    expect(setIntervalSpy).toBeCalledTimes(1)
    expect(setIntervalSpy.mock.calls[0][1]).toEqual(waitTime)
    expect(clearIntervalSpy).toBeCalledTimes(0)
    expect(socket.destroy).toBeCalledTimes(0)

    jest.advanceTimersByTime(waitTime)
    expect(socket.destroy).toBeCalledTimes(0)

    jest.advanceTimersByTime(forceTimeout)
    expect(socket.destroy).toBeCalledTimes(1)

    closeServerCallback!()
  })
})
