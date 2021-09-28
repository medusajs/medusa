// TODO
module.exports = {
  operationId: "GetCollection",
  buildEndpoint: (id) => `/admin/collections/${id}`,
  setup: async (manager, api) => {
    const payload = {
      title: "Spring 2021 collection",
    }
    const response = await api.post("admin/collections", payload, {
      headers: {
        Authorization: "Bearer test_token",
      },
    })

    console.log(response)

    return response.data.collection.id
  },
  snapshotMatch: {
    collection: {
      id: expect.stringMatching(/^pcol_*/),
      title: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
