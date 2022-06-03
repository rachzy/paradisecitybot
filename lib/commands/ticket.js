"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
module.exports.run = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message || !message.guild)
        return;
    const servidor = client.guilds.cache.get(message.guild.id);
    if (!servidor)
        return message.delete();
    message.delete();
    const canal = servidor.channels.cache.find((channel) => channel.name === `ticket-${message.author.id}`);
    let embed = new Discord.MessageEmbed()
        .setColor("#696969")
        .setTitle(`TICKET Nº${message.author.id}`)
        .setDescription(`<@${message.author.id}>, Ticket aberto com sucesso!\nPor gentileza, envie o seu problema.`)
        .setFooter(`Enviei uma mensagem para os Administradores, logo estarão aqui para auxiliá-lo`);
    if (canal)
        return;
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
        .then((msg) => __awaiter(void 0, void 0, void 0, function* () {
        msg.send(embed);
        msg.send(`<@${message.author.id}>`).then((mencao) => __awaiter(void 0, void 0, void 0, function* () {
            setTimeout(function () {
                mencao.delete();
            }, 1000);
        }));
    }));
});
