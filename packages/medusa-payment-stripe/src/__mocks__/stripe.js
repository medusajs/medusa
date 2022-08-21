export const StripeMock = {
  customers: {
    create: jest.fn().mockImplementation((data) => {
      if (data.email === "virg@vvd.com") {
        return Promise.resolve({
          id: "cus_vvd",
          email: "virg@vvd.com",
        })
      }
      if (data.email === "lebron@james.com") {
        return Promise.resolve({
          id: "cus_lebron",
          email: "lebron@james.com",
        })
      }
    }),
  },
  paymentIntents: {
    create: jest.fn().mockImplementation((data) => {
      if (data.customer === "cus_123456789_new") {
        return Promise.resolve({
          id: "pi_lebron",
          amount: 100,
          customer: "cus_123456789_new",
          description: data?.description,
        })
      }
      if (data.customer === "cus_lebron") {
        return Promise.resolve({
          id: "pi_lebron",
          amount: 100,
          customer: "cus_lebron",
          description: data?.description,
        })
      }
    }),
    retrieve: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
      })
    }),
    update: jest.fn().mockImplementation((pi, data) => {
      if (data.customer === "cus_lebron_2") {
        return Promise.resolve({
          id: "pi_lebron",
          customer: "cus_lebron_2",
          amount: 1000,
        })
      }
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
      })
    }),
    capture: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
        status: "succeeded",
      })
    }),
    cancel: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        status: "cancelled",
      })
    }),
  },
  refunds: {
    create: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        id: "re_123",
        payment_intent: "pi_lebron",
        amount: 1000,
        status: "succeeded",
      })
    }),
  },
}

const stripe = jest.fn(() => StripeMock)

export default stripe
