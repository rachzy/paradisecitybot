const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const mysql = require("mysql");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
client.on("ready", () => {
  client.user.setActivity("discord.gg/fvgzRYjHET");
});

client.on("message", (msg) => {
  let canais = ["838590966821683241"];
  let palavras = ["!whitelist", "!mensagem 1", "!mensagem 2"];
  if (
    !new RegExp(palavras.join("|", "g")).test(msg.content) &&
    canais.includes(msg.channel.id)
  ) {
    msg.delete();
  }
});

client.on("raw", async (dados) => {
  if (
    dados.t !== "MESSAGE_REACTION_ADD" &&
    dados.t !== "MESSAGE_REACTION_REMOVE"
  )
    return;
  if (dados.d.message_id != "886216752902586389") return;
  let servidor = client.guilds.cache.get("878747296639115304");

  const canal = servidor.channels.cache.find(
    (ch) => ch.name === `ticket-${dados.d.user_id}`
  );
  const membro = servidor.members.cache.get(dados.d.user_id);
  const membro2 = dados.d.user_id;

  let embed = await new MessageEmbed()
    .setColor("#696969")
    .setTitle(`TICKET Nº${dados.d.user_id}`)
    .setDescription(
      `<@${membro2}>, Ticket aberto com sucesso!\nPor gentileza, envie o seu problema.`
    )
    .setFooter(
      `Enviei uma mensagem para os Administradores, logo entarão aqui para auxiliá-lo`
    );

  if (dados.t === "MESSAGE_REACTION_ADD") {
    if (dados.d.emoji.name === "📩") {
      if (canal) return;
      servidor.channels
        .create(`ticket-${dados.d.user_id}`, {
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
              id: dados.d.user_id,
            },
            {
              deny: "VIEW_CHANNEL",
              id: dados.d.guild_id,
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
        .then(async (msg) => {
          msg.send(embed);
          msg.send(`<@${dados.d.user_id}>`).then(async (mencao) => {
            setTimeout(function () {
              mencao.delete();
            }, 1000);
          });
        });
    }
  }
});

client.on("message", (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);

  try {
    let commandFile = require(`./comandos/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (err.code == "MODULE_NOT_FOUND") return;
    console.error(err);
  }
});

client.login(config.token);
