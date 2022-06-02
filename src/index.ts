import {
  Channel,
  ChannelData,
  Emoji,
  Message,
  MessageEvent,
  RawOverwriteData,
  ReactionCollectorOptions,
  ReactionEmoji,
  ReactionManager,
  User,
} from "discord.js";

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");

const { MessageEmbed } = require("discord.js");
client.on("ready", () => {
  client.user.setActivity("discord.gg/fvgzRYjHET");
});

client.on("message", (msg: Message) => {
  let canais = ["838590966821683241"];
  let palavras = ["!whitelist", "!mensagem 1", "!mensagem 2"];
  if (
    !new RegExp(palavras.join("|, g")).test(msg.content) &&
    canais.includes(msg.channel.id)
  ) {
    msg.delete();
  }
});

client.on("messageReactionAdd", async (dados: ReactionEmoji, user: User) => {
  if (dados.id != "886216752902586389") return;
  let servidor = client.guilds.cache.get("878747296639115304");

  const canal = servidor.channels.cache.find(
    (ch: ChannelData) => ch.name === `ticket-${dados.id}`
  );
  const membro = servidor.members.cache.get(dados.id);
  const membro2 = user.id;

  let embed = await new MessageEmbed()
    .setColor("#696969")
    .setTitle(`TICKET Nº${dados.id}`)
    .setDescription(
      `<@${membro2}>, Ticket aberto com sucesso!\nPor gentileza, envie o seu problema.`
    )
    .setFooter(
      `Enviei uma mensagem para os Administradores, logo entarão aqui para auxiliá-lo`
    );

  if (dados.name === "📩") {
    if (canal) return;
    servidor.channels
      .create(`ticket-${dados.id}`, {
        type: "text",
        parent: "846504229325766687",
        permissionOverwrites: [
          {
            allow: [
              "VIEW_CHANNEL",
              "READ_MESSAGE_HISTORY",
              "EMBED_LINKS",
              "ATTACH_FILES",
              "SEND_MESSAGES",
            ],
            id: dados.id,
          },
          {
            deny: "VIEW_CHANNEL",
            id: client.user.id,
          },
          {
            allow: [
              "VIEW_CHANNEL",
              "READ_MESSAGE_HISTORY",
              "EMBED_LINKS",
              "ATTACH_FILES",
              "SEND_MESSAGES",
            ],
            id: "886216752902586389",
          },
        ],
      })
      .then(async (msg: Message) => {
        msg.channel.send(embed);
        msg.channel.send(`<@${dados.id}>`).then(async (mencao: Message) => {
          setTimeout(function () {
            mencao.delete();
          }, 1000);
        });
      });
  }
});

client.on("message", (message: Message) => {
  console.log(`${message.author.username} sent a message: ${message.content}`);
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);

  try {
    let commandFile = require(`./comandos/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err: any) {
    if (err.code === "MODULE_NOT_FOUND") return;
    console.error(err);
  }
});

client.login(config.token);
