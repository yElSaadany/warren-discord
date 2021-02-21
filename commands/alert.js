const axios = require("axios");

module.exports = {
  name: "alert",
  description: "set alert prices CDC Exchange API's instruments",
  execute(message, args) {
    const base = args[1].toUpperCase();
    const destination = args[0].toUpperCase();
    const price = args[2];

    axios
      .get(
        `http://localhost:3000/alert/${destination}_${base}/${price}/${message.author.id}`
      )
      .then((res) => {
        message.channel.send(
          `Your one-time alert has been registered <@${message.author.id}>.`
        );
      });
  },
};
