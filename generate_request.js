const crypto = require("crypto-js");
require("dotenv").config();

const signRequest = (request, apiKey, apiSecret, justSig = false) => {
  const { id, method, params, nonce } = request;

  const paramsString =
    params == null
      ? ""
      : Object.keys(params)
          .sort()
          .reduce((a, b) => {
            return a + b + params[b];
          }, "");

  const sigPayload = method + id + apiKey + paramsString + nonce;

  request.sig = crypto
    .HmacSHA256(sigPayload, apiSecret)
    .toString(crypto.enc.Hex);

  if (justSig) return request.sig;
  else return request;
};

const createLimitOrder = (side, quantity, destination, source, price) => {
  return JSON.stringify(
    signRequest(
      {
        id: 11,
        method: "private/create-order",
        api_key: process.env.CDC_API_KEY,
        params: {
          instrument_name: `${destination.toUpperCase()}_${source.toUpperCase()}`,
          side,
          type: "LIMIT",
          price,
          quantity,
          client_oid: "my_order_0002",
          time_in_force: "GOOD_TILL_CANCEL",
          exec_inst: "POST_ONLY",
        },
        nonce: Date.now(),
      },
      process.env.CDC_API_KEY,
      process.env.CDC_SECRET_KEY
    )
  );
};

const cancelOrder = (orderId, instrument_name) => {
  return JSON.stringify(
    signRequest(
      {
        id: 11,
        method: "private/cancel-order",
        api_key: process.env.CDC_API_KEY,
        params: {
          instrument_name,
          order_id: orderId,
        },
        nonce: Date.now(),
      },
      process.env.CDC_API_KEY,
      process.env.CDC_SECRET_KEY
    )
  );
};

const getOrderInfo = (orderId) => {
  return JSON.stringify(
    signRequest(
      {
        id: 11,
        method: "private/get-order-detail",
        api_key: process.env.CDC_API_KEY,
        params: {
          order_id: orderId,
        },
        nonce: Date.now(),
      },
      process.env.CDC_API_KEY,
      process.env.CDC_SECRET_KEY
    )
  );
};

const getAccountSummary = (coin = "BTC") => {
  return JSON.stringify(
    signRequest(
      {
        id: 11,
        method: "private/get-account-summary",
        api_key: process.env.CDC_API_KEY,
        params: {
          currency: coin,
        },
        nonce: Date.now(),
      },
      process.env.CDC_API_KEY,
      process.env.CDC_SECRET_KEY
    )
  );
};

module.exports.getAccountSummary = getAccountSummary;
module.exports.createLimitOrder = createLimitOrder;
module.exports.cancelOrder = cancelOrder;
module.exports.getOrderInfo = getOrderInfo;
