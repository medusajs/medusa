export default async ({ container }) => {
  const storeService = container.resolve("storeService")
  const profileService = container.resolve("shippingProfileService")

  await storeService.create()
  await profileService.createDefault()
}
