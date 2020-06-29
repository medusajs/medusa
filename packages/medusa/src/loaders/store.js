/**
 * Registers all services in the services directory
 */
export default ({ container }) => {
  const storeService = container.resolve("storeService")
  return storeService.create()
}
