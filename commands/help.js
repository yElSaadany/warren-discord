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
        .setFooter("<3")
    );
  },
};
