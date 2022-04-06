const _validateSignature = function (razorpay_payment_id,razorpay_order_id,secret_key)
  {
    
      let crypto = require("crypto");
      let body = razorpay_order_id + "|" + razorpay_payment_id
      let expectedSignature = crypto.createHmac('sha256', secret_key)
                                  .update(body.toString())
                                  .digest('hex');
     //                             console.log("sig received " ,razorpay_signature);
     //                             console.log("sig generated " ,expectedSignature);
     return expectedSignature 
  }

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
          notes: {cart_id:"TestCart",customer_id:"abcd"},
          created_at:1234566})
      }
      else {
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
          notes: {cart_id:"TestCart",customer_id:"abcd"},
          created_at:1234566})
      }
    }),
    fetch: jest.fn().mockImplementation((data) => {
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
        notes: {cart_id:"TestCart",razorpay_payment_id:"pay_JFbzW5PV980gUH",razorpay_order_id:"order_JFapRWBCWCR3bx",
        razorpay_signature:_validateSignature("pay_JFbzW5PV980gUH","order_JFapRWBCWCR3bx","YYY")},
        created_at:1234566})

    }),
    edit: jest.fn().mockImplementation((pi, data) => {
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

  payments: {
    fetch: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        "id": "pay_JFbzW5PV980gUH",
        "entity": "payment",
        "amount": 1000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_JFapRWBCWCR3bx",
        "invoice_id": null,
        "international": false,
        "method": "upi",
        "amount_refunded": 0,
        "refund_status": null,
        "captured": true,
        "description": "Purchase Shoes",
        "card_id": null,
        "bank": null,
        "wallet": null,
        "vpa": "gaurav.kumar@exampleupi",
        "email": "gaurav.kumar@example.com",
        "contact": "+919999999999",
        "customer_id": "cust_DitrYCFtCIokBO",
        "notes": [],
        "fee": 24,
        "tax": 4,
        "error_code": null,
        "error_description": null,
        "error_source": null,
        "error_step": null,
        "error_reason": null,
        "acquirer_data": {
          "rrn": "033814379298"
        },
        "created_at": 1606985209
      })
    }),
    refund: jest.fn().mockImplementation((data) => {
      return Promise.resolve(
        {
          "id": "rfnd_FP8QHiV938haTz",
          "entity": "refund",
          "amount": 500100,
          "receipt": "Receipt No. 31",
          "currency": "INR",
          "payment_id": "pay_FCXKPFtYfPXJPy",
          "notes": [],
          "receipt": null,
          "acquirer_data": {
            "arn": null
          },
          "created_at": 1597078866,
          "batch_id": null,
          "status": "processed",
          "speed_processed": "normal",
          "speed_requested": "normal"
        })
      }
    )
  }   
}

const razorpay = jest.fn(() => RazorpayMock)

export default razorpay
