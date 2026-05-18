export const createBrandFixture = {
  name: "Test Brand",
  slug: "test-brand",
}

export const createBrandFixtureWithOrg = (orgId: string) => ({
  name: "Test Brand",
  slug: "test-brand",
  org_id: orgId,
})
