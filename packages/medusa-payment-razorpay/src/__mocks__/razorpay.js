export const RazorpayMock = {
  customers: {
    create: jest.fn().mockImplementation((data) => {
      if (data.email === "virg@vvd.com") {
        return Promise.resolve({
          id: "cus_vvd",
          email: "virg@vvd.com",
          created_at: 1234567,
        })
      }
      if (data.email === "lebron@james.com") {
        return Promise.resolve({
          id: "cus_lebron",
          cateated_at: 1234567,
        })
      }
    }),
    edit: jest.fn().mockImplementation((id,data) => {
      if (id === "cus_vvd") {
        return Promise.resolve({
          id: "cus_vvd",
          email: data.email,
          name:data.name,
          contact:data.contact,
          notes:{fullname:data.name,customer_id:id},
          gstin:data.gstin,
          created_at: 1234567,
        })
      }
      if (id === "cus_lebron") {
        return Promise.resolve({
          id: "cus_lebron",
          email: data.email,
          name:data.name,
          contact:data.contact,
          notes:{fullname:data.name,customer_id:id},
          gstin:data.gstin,
          created_at: 1234567,
        })
      }
    })
  },

  orders: {
    create: jest.fn().mockImplementation((data) => {
      if (data.customer === "cus_123456789_new") {
        return Promise.resolve({ 
          id: "order_XYZG",
          entity: "order",
          amount: 100*100,
          amount_paid: 0,
          amount_due:100*100,
          currency: "INR",
          receipt: "12345",
          status: "created",
          attempts: 0,
          offer_id:null,
          notes: {cart_id:"TestCart"},
          created_at:1234566})
      }
      if (data.customer === "cus_lebron") {
        return Promise.resolve({ 
          id: "order_ABCD",
          attempts:0,
          entity: "order",
          amount: 100*100,
          amount_paid: 0,
          amount_due:100*100,
          offer_id:null,
          currency: "INR",
          receipt: "12345",
          status: "created",
          notes: {cart_id:"TestCart"},
          created_at:1234566})
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

const razorpay = jest.fn(() => RazorpayMock)

export default razorpay
