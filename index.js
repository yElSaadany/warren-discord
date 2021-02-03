require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");

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

  client.setTimeout(checkTradingHours, 60000);

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

const sendMessageInChannel = (id, message) => {
  client.channels.fetch(id).then((channel) => channel.send(message));
};

const checkTradingHours = () => {
  const now = new Date();
  console.log("here");

  if (now.getDay() in [1, 2, 3, 4, 5]) {
    console.log("there");
    const hours = now.getHours();
    const minutes = now.getMinutes();
    console.log(hours);
    console.log(minutes);
    if (hours === 9 && minutes === 0) {
      sendMessageInChannel("802291626193059930", "EURONEXT IS OPEN");
    } else if (hours === 15 && minutes === 30) {
      sendMessageInChannel("802291626193059930", "US MARKETS ARE OPEN");
    } else if (hours === 17 && minutes === 30) {
      sendMessageInChannel("802291626193059930", "EURONEXT IS CLOSED");
    } else if (hours === 22 && minutes === 0) {
      sendMessageInChannel("802291626193059930", "US MARKETS ARE CLOSED");
    }
  }
};

client.login(process.env.DISCORD_TOKEN);
