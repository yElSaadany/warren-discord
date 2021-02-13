const axios = require("axios");
const { createLimitOrder } = require("../generate_request");

module.exports = {
  name: "trade",
  description: "trade using the CDC Exchange API",
  execute(message, side, args) {
    const req = createLimitOrder(side, args[0], args[1], args[2], args[3]);
    axios
      .get(
        `http://localhost:3000/subscribe/order/${args[1].toUpperCase()}_${args[2].toUpperCase()}`
      )
      .then((res) => {
        axios
          .post("https://api.crypto.com/v2/private/create-order", req, {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            message.channel.send(
              `**Order ${res.data["result"]["order_id"]} has been sent to the Crypto.com Exchange.**`
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error("ERROR:" + err));
  },
};
