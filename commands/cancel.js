const axios = require("axios");
const { cancelOrder, getOrderInfo } = require("../generate_request");

module.exports = {
  name: "cancel",
  description: "cancel order using the CDC Exchange API",
  execute(message, args) {
    axios
      .post(
        "https://api.crypto.com/v2/private/get-order-detail",
        getOrderInfo(args[0]),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        axios
          .post(
            "https://api.crypto.com/v2/private/cancel-order",
            cancelOrder(
              args[0],
              res.data["result"]["order_info"]["instrument_name"]
            ),
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((res) => {
            message.channel.send(
              `**Order ${res.data["result"]["order_id"]} has been sent to the Crypto.com Exchange.**`
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  },
};
