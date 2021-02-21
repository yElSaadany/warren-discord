require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

/** Initialize express and define a port
 * For webhook stuff
 * Maybe for API endpoints later
 */
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.post("/tradinghours", (req, res) => {
  sendMessageInChannel("802291626193059930", req.body.message);
  res.status(200).end();
});

/**
 * Discord bot init
 */
const client = new Discord.Client();
const prefix = "$";

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

  app.listen(PORT, () =>
    console.log(`Warren is live on port ${PORT} & connected to Discord.`)
  );
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
    } else if (
      command === "buy" &&
      message.author["tag"] === process.env.DISCORD_USERID
    ) {
      client.commands.get("trade").execute(message, "BUY", args);
    } else if (
      command === "sell" &&
      message.author["tag"] === process.env.DISCORD_USERID
    ) {
      client.commands.get("trade").execute(message, "SELL", args);
    } else if (
      command === "cancel" &&
      message.author["tag"] === process.env.DISCORD_USERID
    ) {
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

client.login(process.env.DISCORD_TOKEN);
