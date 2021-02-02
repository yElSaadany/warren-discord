module.exports = {
  name: "ping",
  description: "pong!",
  execute(message, args) {
    const msg = "> pong!";

    message.channel.send(msg);
  },
};
