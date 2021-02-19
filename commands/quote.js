const fs = require("fs");
require("dotenv").config();

module.exports = {
  name: "quote",
  description: "stream in voice channel or write a quote of Warren Buffett",
  execute(message, client, args) {
    const speaker = args[0]
      ? args[0]
      : ["buffett", "saylor"][Math.floor(Math.random() * 2)];
    console.log(speaker);
    client.channels.fetch("781218691366781011").then(async (vc) => {
      const voiceConn = await vc.join();
      const audioQuotes = fs.readdirSync(
        process.env.ASSETS_PATH + `/audio/${speaker}`
      );
      voiceConn.play(
        `${process.env.ASSETS_PATH}/audio/${speaker}/${
          audioQuotes[Math.floor(Math.random() * audioQuotes.length)]
        }`
      );
    });
  },
};
