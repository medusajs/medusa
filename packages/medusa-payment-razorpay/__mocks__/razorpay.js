"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.RazorpayMock = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var _validateSignature = function _validateSignature(razorpay_payment_id, razorpay_order_id, secret_key)
{

  var crypto = require("crypto");
  var body = razorpay_order_id + "|" + razorpay_payment_id;
  var expectedSignature = crypto.createHmac('sha256', secret_key).
  update(body.toString()).
  digest('hex');
  //                             console.log("sig received " ,razorpay_signature);
  //                             console.log("sig generated " ,expectedSignature);
  return expectedSignature;
};

var RazorpayMock = {
  customers: {
    create: jest.fn().mockImplementation(function (data) {
      if (data.email === "virg@vvd.com") {
        return Promise.resolve({
          id: "cus_vvd",
          email: "virg@vvd.com",
          created_at: 1234567 });

      }

      if (data.email === "lebron@james.com") {
        return Promise.reject({
          id: "cus_lebron",
          created_at: 1234567 });

      }

    }),
    fetch: jest.fn().mockImplementation(function (id, data) {
      return Promise.resolve({
        id: "cust_1Aa00000000001",
        entity: "customer",
        name: "james lebron",
        email: "lebron@james.com",
        contact: "9876543210",
        gstin: "37AADCS0472N1Z1",
        notes: { fullname: "james lebron", customer_id: "cust_1Aa00000000001" },
        created_at: 1234567890 });

    }),
    all: jest.fn().mockImplementation(function (id, data)
    {
      return Promise.resolve({
        "entity": "collection",
        "count": 1,
        "items": [
        {
          id: "cust_1Aa00000000001",
          entity: "customer",
          name: "james lebron",
          email: "lebron@james.com",
          contact: "9876543210",
          gstin: "37AADCS0472N1Z1",
          notes: { fullname: "james lebron", customer_id: "cust_1Aa00000000001" },
          created_at: 1234567890 }] });



    }),

    edit: jest.fn().mockImplementation(function (id, data) {
      if (id === "cus_vvd") {
        return Promise.resolve({
          id: "cus_vvd",
          email: data.email,
          name: data.name,
          contact: data.contact,
          notes: { fullname: data.name, customer_id: id },
          gstin: data.gstin,
          created_at: 1234567 });

      }
      if (id === "cus_lebron") {
        return Promise.resolve({
          id: "cus_lebron",
          email: data.email,
          name: data.name,
          contact: data.contact,
          notes: { fullname: data.name, customer_id: id },
          gstin: data.gstin,
          created_at: 1234567 });

      }
    }) },


  orders: {
    create: jest.fn().mockImplementation(function (data) {
      if (data.customer === "cus_123456789_new") {
        return Promise.resolve({
          id: "order_XYZG",
          entity: "order",
          amount: 100 * 100,
          amount_paid: 0,
          amount_due: 100 * 100,
          currency: "INR",
          receipt: "12345",
          status: "created",
          attempts: 0,
          offer_id: null,
          notes: { cart_id: "TestCart", customer_id: "abcd" },
          created_at: 1234566 });
      } else
      {
        return Promise.resolve({
          id: "order_ABCD",
          attempts: 0,
          entity: "order",
          amount: 100 * 100,
          amount_paid: 0,
          amount_due: 100 * 100,
          offer_id: null,
          currency: "INR",
          receipt: "12345",
          status: "created",
          notes: { cart_id: "TestCart", customer_id: "abcd" },
          created_at: 1234566 });
      }
    }),
    fetch: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "order_ABCD",
        attempts: 0,
        entity: "order",
        amount: 100 * 100,
        amount_paid: 0,
        amount_due: 100 * 100,
        offer_id: null,
        currency: "INR",
        receipt: "12345",
        status: "created",
        notes: { cart_id: "TestCart", razorpay_payment_id: "pay_JFbzW5PV980gUH", razorpay_order_id: "order_JFapRWBCWCR3bx",
          razorpay_signature: _validateSignature("pay_JFbzW5PV980gUH", "order_JFapRWBCWCR3bx", "XXX") },
        created_at: 1234566 });

    }),
    edit: jest.fn().mockImplementation(function (pi, data) {
      if (data.customer === "cus_lebron_2") {
        return Promise.resolve({
          id: "pi_lebron",
          customer: "cus_lebron_2",
          amount: 1000 });

      }
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000 });

    }),
    capture: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
        status: "succeeded" });

    }),
    cancel: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        status: "cancelled" });

    }) },


  payments: {
    fetch: jest.fn().mockImplementation(function (data) {
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
          "rrn": "033814379298" },

        "created_at": 1606985209 });

    }),
    refund: jest.fn().mockImplementation(function (data) {var _Promise$resolve;
      return Promise.resolve((_Promise$resolve = {

        "id": "rfnd_FP8QHiV938haTz",
        "entity": "refund",
        "amount": 500100,
        "receipt": "Receipt No. 31",
        "currency": "INR",
        "payment_id": "pay_FCXKPFtYfPXJPy",
        "notes": [] }, _defineProperty(_Promise$resolve, "receipt",
      null), _defineProperty(_Promise$resolve,
      "acquirer_data", {
        "arn": null }), _defineProperty(_Promise$resolve,

      "created_at", 1597078866), _defineProperty(_Promise$resolve,
      "batch_id", null), _defineProperty(_Promise$resolve,
      "status", "processed"), _defineProperty(_Promise$resolve,
      "speed_processed", "normal"), _defineProperty(_Promise$resolve,
      "speed_requested", "normal"), _Promise$resolve));

    }) } };exports.RazorpayMock = RazorpayMock;




var razorpay = jest.fn(function () {return RazorpayMock;});var _default =

razorpay;exports["default"] = _default;