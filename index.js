require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const prefix = "$";
const maintenance = false;

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

  console.log("Warren is live!");
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
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
