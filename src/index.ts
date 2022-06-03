import { ChannelData, Message, ReactionEmoji, User } from "discord.js";

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");

const { MessageEmbed } = require("discord.js");
client.on("ready", () => {
  client.user.setActivity("discord.gg/fvgzRYjHET");
});

client.on("message", (message: Message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);

  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err: any) {
    if (err.code === "MODULE_NOT_FOUND") return;
    console.error(err);
  }
});

client.login(config.token);
