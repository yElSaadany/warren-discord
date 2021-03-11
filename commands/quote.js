const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = {
  name: "quote",
  description: "stream in voice channel or write a quote of Warren Buffett",
  execute(message, client, args) {
    const speaker = args[0]
      ? args[0]
      : ["buffett", "saylor"][Math.floor(Math.random() * 2)];
    console.log(speaker);
    const audioDir = path.join(__dirname, `/../assets/audio/${speaker}`);
    const voiceChannelId = message.member.voice.channelID;
    client.channels.fetch(voiceChannelId).then(async (vc) => {
      const voiceConn = await vc.join();
      const audioQuotes = fs.readdirSync(audioDir);
      voiceConn.play(
        `${audioDir}/${
          audioQuotes[Math.floor(Math.random() * audioQuotes.length)]
        }`
      );
    });
  },
};
