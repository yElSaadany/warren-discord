const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const prefix = "$";

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Warren is live!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    client.commands.get("ping").execute(message, args);
  } else if (command === "price" || command === "p") {
    client.commands.get("price").execute(message, args);
  }
});

client.login("Nzg0NzY1Njk2OTc3NTM0OTc2.X8uEAg.hCPLMVJbc_DEjYw7G_UruWLSFjc");
