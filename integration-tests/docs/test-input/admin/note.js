// TODO
module.exports = {
  operationId: "GetNote",
  buildEndpoint: (id) => `/admin/notes/${id}`,
  setup: async (manager, api) => {
    const payload = {
      resource_id: "order_id",
      resource_type: "order",
      value: "note value",
    }

    const response = await api.post("/admin/notes", payload, {
      headers: {
        Authorization: "Bearer test_token",
      },
    })

    return response.data.note.id
  },
  snapshotMatch: {
    note: {
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      author: {
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      resource_id: "order_id",
      resource_type: "order",
      value: "note value",
    },
  },
}
