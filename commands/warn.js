const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    // !warn [user] [reden]

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Alleen staff leden kunnen dit.");

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));

    if (!user) return message.channel.send("Geef een speler op..");

    if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Je kan geen staff-leden warnen!");

    var reason = args.join(" ").slice(22);

    if (!reason) return message.channel.send("Geef een reden op..");

    var warnEmbed = new discord.RichEmbed()
        .setDescription("Warn")
        .setColor("#FF0000")
        .addField("Gebruiker:", user)
        .addField("Moderator:", message.author)
        .addField("Reden:", reason);

    var warnChannel = message.guild.channels.find(`name`, "logs");
    if (!warnChannel) return message.channel.send("Maak het kanaal **logs** aan.");

    warnChannel.send(warnEmbed);

    var warn2Embed = new discord.RichEmbed()
        .setDescription("Warn")
        .setColor("#FF0000")
        .addField("Moderator:", message.author)
        .addField("Reden:", reason);

    user.send(warn2Embed);

    return message.channel.send(`${user} is succesvol gewaarschuwd! \n Reden: ${reason}.`);

}


module.exports.help = {
    name: "warn"
}