const fs = require("fs");
require("dotenv").config();

module.exports = {
  name: "quote",
  description: "stream in voice channel or write a quote of Warren Buffett",
  execute(message, client, args) {
    client.channels.fetch("781218691366781011").then(async (vc) => {
      const voiceConn = await vc.join();
      const audioQuotes = fs.readdirSync(process.env.ASSETS_PATH + "/audio");
      voiceConn.play(
        `${process.env.ASSETS_PATH}/audio/${
          audioQuotes[Math.floor(Math.random() * audioQuotes.length)]
        }`
      );
    });
  },
};
