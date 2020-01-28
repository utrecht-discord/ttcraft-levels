const discord = require("discord.js");
const botconfig = require("./botconfig");
const levelFile = require("./data/levels.json")
const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("Kon geen files vinden!");
        return;
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`${f} is geladen!`);
        console.log(`TTCraft is online!`);

        bot.commands.set(fileGet.help.name, fileGet)

    })

});


bot.on("ready", () => {
    console.log("Bot is online");

    bot.user.setPresence({
        status: "online",
        game: {
            name: "TTCraft || play.ttcraft.eu || ?help",
            type: "PLAYING"
        }
    });
});

bot.on("guildMemberAdd", member => {

    const channel = member.guild.channels.find("name", "👋welkom");
    if (!channel) console.log("Kanaal `Welkom` niet gevonden..");

    var JoinMessage = new discord.RichEmbed()
        .setTitle("_Er is een speler gejoind!_")
        .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
        .setDescription(`Hey ${member.user.username}, **Welkom in de server!**`)
        .setColor("#00ff00")
        .setTimestamp()
        .setFooter("Join system");

    channel.send(JoinMessage);

});


bot.on("guildMemberRemove", member => {

    const lchannel = member.guild.channels.find("name", "👋tot-ziens");
    if (!lchannel) console.log("Kanaal `tot-ziens` niet gevonden..");

    var JoinMessage = new discord.RichEmbed()
        .setTitle("_Er is een speler weggegaan!_")
        .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
        .setDescription(`${member.user.username} is weggegaan!`)
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter("Leave system");

    lchannel.send(JoinMessage);

});


bot.on("message", async message => {

    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botconfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var arguments = messageArray.slice(1);


    var commands = bot.commands.get(command.slice(prefix.length));

    if (commands) commands.run(bot, message, arguments);

    var randomXp = Math.floor(Math.random(1) * 15) + 1;

    var idUser = message.author.id;

    if (!levelFile[idUser]) {


        levelFile[idUser] = {

            xp: 0,
            level: 0 


        }

    }
        console.log(randomXp);



    levelFile[idUser].xp += randomXp;

    var levelUser = levelFile[idUser].level;
    var xpuser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;

    if (!nextLevelXp === 0) nextLevelXp = 100;

    if (xpuser >= nextLevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./data/levels.json", JSON.stringify(levelFile), err => {

            if (err) console.log(err);

        });

        var embedLevel = new discord.RichEmbed()
        .setTitle("**LEVEL UP!!**")
        .addField("Level: ",  levelFile[idUser].level)
        .setColor("74ff87");

        message.channel.send(embedLevel);
    }

});




bot.login(process.env.token); 