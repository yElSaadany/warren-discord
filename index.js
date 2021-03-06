require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const express = require("express");

const client = new Discord.Client();
const prefix = "$";
const ADMIN = false;
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res
    .status(200)
    .json({
      message: "What are you doing here? Get out of my HTTP endpoints!",
    });
});

let maintenance = false;
if (process.argv.length === 3 && process.argv[2] === "maintenance") {
  maintenance = true;
}

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => {
  client.user.setPresence({
    activity: { name: `${prefix}help for commands`, type: "WATCHING" },
  });
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  console.log(
    `${message.author["username"]}#${message.author["discriminator"]} on "${message.guild.name}": ${command} ${args}`
  );

  if (maintenance) {
    message.channel.send("Warren is in maintenance. **Please Hold**");
  } else {
    if (command === "ping") {
      client.commands.get("ping").execute(message, args);
    } else if (command === "price" || command === "p") {
      client.commands.get("price").execute(message, args);
    } else if (command === "help" || command === "h") {
      client.commands.get("help").execute(message);
    } else if (command === "convert") {
      client.commands.get("convert").execute(message, args);
    } else if (command === "balance") {
      client.commands.get("balance").execute(message, args);
    } else if (command === "buy" && ADMIN) {
      client.commands.get("trade").execute(message, "BUY", args);
    } else if (command === "sell" && ADMIN) {
      client.commands.get("trade").execute(message, "SELL", args);
    } else if (command === "cancel" && ADMIN) {
      client.commands.get("cancel").execute(message, args);
    } else if (command === "quote") {
      client.commands.get("quote").execute(message, client, args);
    } else if (command === "alert") {
      client.commands.get("alert").execute(message, args);
    }
  }
});

const sendMessageInChannel = (id, message) => {
  client.channels.fetch(id).then((channel) => channel.send(message));
};

app.listen(process.env.PORT || PORT, () => {
  client.login(process.env.DISCORD_TOKEN);
  console.log("Warren Bot is live!");
});
