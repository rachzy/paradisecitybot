import { Client, GuildChannel, Message } from "discord.js";

const Discord = require("discord.js");

module.exports.run = async (client: Client, message: Message) => {
  if (!message || !message.guild) return;
  const servidor = client.guilds.cache.get(message.guild.id);

  if (!servidor) return message.delete();

  message.delete();
  const canal = servidor.channels.cache.find(
    (channel) => channel.name === `ticket-${message.author.id}`
  );

  let embed = new Discord.MessageEmbed()
    .setColor("#696969")
    .setTitle(`TICKET Nº${message.author.id}`)
    .setDescription(
      `<@${message.author.id}>, Ticket aberto com sucesso!\nPor gentileza, envie o seu problema.`
    )
    .setFooter(
      `Enviei uma mensagem para os Administradores, logo estarão aqui para auxiliá-lo`
    );

  if (canal) return;
  servidor.channels
    .create(`ticket-${message.author.id}`, {
      type: "text",
      permissionOverwrites: [
        {
          allow: [
            "VIEW_CHANNEL",
            "READ_MESSAGE_HISTORY",
            "EMBED_LINKS",
            "ATTACH_FILES",
            "SEND_MESSAGES",
          ],
          id: message.author.id,
        },
        {
          deny: "VIEW_CHANNEL",
          id: servidor.id,
        },
      ],
    })
    .then(async (msg) => {
      msg.send(embed);
      msg.send(`<@${message.author.id}>`).then(async (mencao) => {
        setTimeout(function () {
          mencao.delete();
        }, 1000);
      });
    });
};
