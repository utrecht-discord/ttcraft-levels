const discord = require("discord.js");
const levelFile = require("../data/levels.json");

module.exports.run  = async (bot, message, args) => {

    var idUser = message.author.id;

    if (!levelFile[idUser]) {


        levelFile[idUser] = {

            xp: 0,
            level: 0 


        }

    }

    var levelUser = levelFile[idUser].level;
    var xpuser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;

    var whenNextLevel = nextLevelXp - xpuser;

    var embedLevel = new discord.RichEmbed()
    .setTitle(message.author.username)
    .addField("Level: ", levelUser, true)
    .addField("xp", xpuser, true)
    .setFooter(`Je hebt nog ${whenNextLevel} nodig voor het volgende level.`, message.author.displayAvatarURL)
    .setColor("#FF0000");

    message.channel.send(embedLevel);
}


module.exports.help = {
    name: "level"
}