const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "price",
  description: "check cryptocurrency price on coingecko",
  async execute(message, args) {
    if (args.length === 0) {
      message.channel.send("Parameters are missing...");
    } else {
      let currency = "usd";
      var current_coin = args[0];
      if (args.length === 2) {
        currency = args[1];
      }
      await axios
        .get("https://api.coingecko.com/api/v3/coins/list")
        .then((res) => {
          let found = false;
          res.data.map((coin) => {
            if (
              current_coin === coin["id"] ||
              current_coin === coin["symbol"]
            ) {
              current_coin = coin["id"];
              found = true;
            }
          });
          if (!found) {
            message.channel.send("This cryptocurrency is not available.");
          }
        });
      console.log(current_coin);

      axios
        .get("https://api.coingecko.com/api/v3/coins/" + current_coin)
        .then((res) => {
          console.log(res);
          if (
            res.data["market_data"]["current_price"][currency] === undefined
          ) {
            message.channel.send("Destination currency does not exist.");
            return;
          }
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor(
              res.data["market_data"]["price_change_24h"] > 0
                ? "#00ff00"
                : "#ff0000"
            )
            .setAuthor(
              res.data["name"] +
                " is at " +
                res.data["market_data"]["current_price"][currency] +
                " " +
                currency.toUpperCase(),
              res.data["image"]["small"],
              "https://www.coingecko.com/en/coins/" + current_coin
            )
            .setDescription(
              "[More info...](https://www.coingecko.com/en/coins/" +
                res.data["id"] +
                ")"
            )
            .setTimestamp()
            .setFooter(
              "From CoinGecko",
              "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fbitcoinist.com%2Fwp-content%2Fuploads%2F2014%2F06%2FCoinGecko_Logo.jpg&f=1&nofb=1"
            );

          message.channel.send(exampleEmbed);
        })
        .catch((error) => {
          throw error;
        });
    }
  },
};
