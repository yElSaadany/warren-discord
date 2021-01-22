const axios = require("axios");

module.exports = {
  name: "price",
  description: "check cryptocurrency price on coingecko",
  execute(message, args) {
    if (args.length === 0) {
      message.channel.send("Parameters are missing...");
    } else {
      let currency = "usd";
      if (args.length === 2) {
        currency = args[1];
      }
      axios
        .get(
          "https://api.coingecko.com/api/v3/simple/price?ids=" +
            args[0] +
            "&vs_currencies=" +
            currency +
            ""
        )
        .then((res) => {
          console.log(res);
          message.channel.send(
            args[0] +
              " is at " +
              res.data[args[0]][currency] +
              " " +
              currency.toUpperCase()
          );
        })
        .catch((error) => {
          throw error;
        });
    }
  },
};
