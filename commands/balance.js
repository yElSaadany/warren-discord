const axios = require("axios");
const { getAccountSummary } = require("../generate_request");

module.exports = {
  name: "balance",
  description: "get account balance from CDC Exchange API",
  execute(message, args) {
    const req = getAccountSummary(args[0] ? args[0].toUpperCase() : "BTC");
    console.log(req);
    axios
      .post("https://api.crypto.com/v2/private/get-account-summary", req, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data["result"]["accounts"]);
        message.channel.send(
          `You have **${res.data["result"]["accounts"][0]["available"]} available ${res.data["result"]["accounts"][0]["currency"]}** in you Crypto.com Exchange Account.`
        );
      })
      .catch((err) => console.error(err));
  },
};
