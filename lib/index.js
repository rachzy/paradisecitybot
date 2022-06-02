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
const client = new Discord.Client();
const config = require("../config.json");
const { MessageEmbed } = require("discord.js");
client.on("ready", () => {
    client.user.setActivity("discord.gg/fvgzRYjHET");
});
client.on("message", (msg) => {
    let canais = ["838590966821683241"];
    let palavras = ["!whitelist", "!mensagem 1", "!mensagem 2"];
    if (!new RegExp(palavras.join("|, g")).test(msg.content) &&
        canais.includes(msg.channel.id)) {
        msg.delete();
    }
});
client.on("messageReactionAdd", (dados, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (dados.id != "886216752902586389")
        return;
    let servidor = client.guilds.cache.get("878747296639115304");
    const canal = servidor.channels.cache.find((ch) => ch.name === `ticket-${dados.id}`);
    const membro = servidor.members.cache.get(dados.id);
    const membro2 = user.id;
    let embed = yield new MessageEmbed()
        .setColor("#696969")
        .setTitle(`TICKET Nº${dados.id}`)
        .setDescription(`<@${membro2}>, Ticket aberto com sucesso!\nPor gentileza, envie o seu problema.`)
        .setFooter(`Enviei uma mensagem para os Administradores, logo entarão aqui para auxiliá-lo`);
    if (dados.name === "📩") {
        if (canal)
            return;
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
            .then((msg) => __awaiter(void 0, void 0, void 0, function* () {
            msg.channel.send(embed);
            msg.channel.send(`<@${dados.id}>`).then((mencao) => __awaiter(void 0, void 0, void 0, function* () {
                setTimeout(function () {
                    mencao.delete();
                }, 1000);
            }));
        }));
    }
}));
client.on("message", (message) => {
    console.log(`${message.author.username} sent a message: ${message.content}`);
    if (message.channel.type === "dm")
        return;
    if (message.author.bot)
        return;
    if (!message.content.startsWith(config.prefix))
        return;
    let command = message.content.split(" ")[0];
    command = command.slice(config.prefix.length);
    let args = message.content.split(" ").slice(1);
    try {
        let commandFile = require(`./comandos/${command}.js`);
        commandFile.run(client, message, args);
    }
    catch (err) {
        if (err.code === "MODULE_NOT_FOUND")
            return;
        console.error(err);
    }
});
client.login(config.token);
