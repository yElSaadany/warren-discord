const Discord = require("discord.js");
const axios = require("axios");

const is_fiat = (currency) => {
  return axios
    .get(
      `https://api.exchangeratesapi.io/latest?base=${currency.toUpperCase()}`
    )
    .then((res) => {
      return "fiat";
    })
    .catch(async (err) => {
      return "crypto";
    });
};

const crypto_to_fiat = (message, amount, source, destination, swap = false) => {
  axios.get("https://api.coingecko.com/api/v3/coins/list").then((res) => {
    let found = false;
    res.data.map((coin) => {
      if (source === coin["id"] || source === coin["symbol"]) {
        found = true;
        console.log(coin["id"]);
        axios
          .get("https://api.coingecko.com/api/v3/coins/" + coin["id"])
          .then((res) => {
            if (!destination in res.data["market_data"]["current_price"]) {
              message.channel.send(
                `**Destination currency ${destination} is not available.**`
              );
            } else {
              if (swap) {
                message.channel.send(
                  `${amount} ${source.toUpperCase()} = ${
                    amount /
                    res.data["market_data"]["current_price"][destination]
                  } ${destination.toUpperCase()}`
                );
                return (
                  amount / res.data["market_data"]["current_price"][destination]
                );
              } else {
                message.channel.send(
                  `${amount} ${source.toUpperCase()} = ${
                    amount *
                    res.data["market_data"]["current_price"][destination]
                  } ${destination.toUpperCase()}`
                );
                return (
                  amount * res.data["market_data"]["current_price"][destination]
                );
              }
            }
          });
      }
    });
    if (!found) {
      message.channel.send(
        `Currency ${source} or ${destination} is not available or does not exist.`
      );
    }
  });
};

module.exports = {
  name: "convert",
  description: "convert currencies between themselves and cryptocurrencies",
  async execute(message, args) {
    if (args.length === 0) {
      message.channel.send(
        "**`Wrong command, try: $convert <amount> <source> <destination>`**"
      );
    } else {
      const amount = args[0];
      let source = args[1].toLowerCase();
      let destination = args[2].toLowerCase();
      let source_fiat = await is_fiat(source);
      let destination_fiat = await is_fiat(destination);

      console.log(source_fiat);
      console.log(destination_fiat);

      if (source_fiat === "fiat" && destination_fiat === "fiat") {
        axios
          .get(
            `https://api.exchangeratesapi.io/latest?base=${source.toUpperCase()}`
          )
          .then((res) => {
            console.log(res.data["rates"]);
            if (destination.toUpperCase() in res.data["rates"]) {
              message.channel.send(
                `${amount} ${source.toUpperCase()} = ${
                  amount * res.data["rates"][destination.toUpperCase()]
                } ${destination.toUpperCase()}`
              );
            } else {
              message.channel.send(
                `**Destination currency ${destination} is not available.**`
              );
            }
          });
      } else if (source_fiat === "crypto") {
        crypto_to_fiat(message, amount, source, destination);
      } else if (source_fiat === "fiat") {
        crypto_to_fiat(message, amount, destination, source, true);
      } else {
        message.channel.send(
          `Currency ${source} or ${destination} is not available or does not exist.`
        );
      }

      /**
      axios
        .get("https://api.coingecko.com/api/v3/coins/" + current_coin)
        .then((res) => {
          if (
            res.data["market_data"]["current_price"][currency] === undefined
          ) {
            message.channel.send("This destination currency is not available.");
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
        });*/
    }
  },
};
