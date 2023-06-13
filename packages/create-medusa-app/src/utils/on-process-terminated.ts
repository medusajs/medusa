export default (fn: Function) => {
  process.on("SIGTERM", () => fn())
  process.on("SIGINT", () => fn())
}
