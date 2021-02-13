const Discord = require("discord.js");
const prefix = "$";

module.exports = {
  name: "help",
  description: "to get a list of the commands Warren can do!",
  execute(message) {
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#0000ff")
        .setAuthor("Here is what I can do!")
        .setDescription("$<command> <arg> [optional arg]")
        .addField(`${prefix}help`, "displays a list of commands")
        .addField(`${prefix}ping`, "pong! to test the bot")
        .addField(
          `${prefix}price <ticker> [currency]`,
          "get the current price of a ticker"
        )
        .addField(
          `${prefix}convert <amount> <source> <destination>`,
          "get the current exchange rate for a trading pair"
        )
        .addField(
          `${prefix}balance <ticker>`,
          "REGISTERED USERS: get your account's balance for a ticker"
        )
        .addField(
          `${prefix}buy|sell <quantity> <destination> <source> <price>`,
          "REGISTERED USERS: place a limit order to buy/sell <quantity> amount of <destination> with <source> at <price>"
        )
        .addField(
          `${prefix}cancel <order_id>`,
          "REGISTERED USERS: cancel an order"
        )
        .setFooter("Made with <3")
    );
  },
};
