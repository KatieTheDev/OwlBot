const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const Config = require('./config.json');
client.commands = new Discord.Collection();

if (Config.translateEnabled === true) {
    const translate = require('google-translate-api')(Config.translateAPIKey);
    const speech = require('./messages');
    const language = require('./langOptions');
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content.startsWith(Config.translatePrefix) && Config.translateEnabled === true) {
        const args = message.content.slice(2).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // It can be a regular ! message. This says to not bother if it doesn't have a prefix, and
        // to not trigger if a bot gives a command.
        if (!message.content.startsWith(translatePrefix) || message.author.bot) {
            return; 
        }

        // Auto-translates the text into the command's language like !japanese, or !french
        if (language.some(ele => ele.name === command)) {
            if (args.length === 0) {
                message.reply(speech.BOT_FULLNAME_AUTO_ERROR);
            } else {
                let lang_to = language.filter(ele => ele.name===command)[0].abrv;
                let text = args.slice(0).join(' ');
                translate(text, {to: lang_to})
                    .then(res => message.channel.send(res.text))
                    .catch(err => message.channel.send(speech.BOT_TRANSLATION_ERROR + err));
            }
        }

        // Auto translates with abbreviation like !ko, !en, or !de
        if (language.some(ele => ele.abrv=== command)) {
            if (args.length === 0) {
                message.reply(speech.BOT_ABBR_AUTO_ERROR);
            } else {
                let lang_to = language.filter(ele => ele.abrv===command)[0].abrv;
                let text = args.slice(0).join(' ');
                translate(text, {to: lang_to})
                    .then(res => message.channel.send(res.text))
                    .catch(err => message.channel.send(speech.BOT_TRANSLATION_ERROR + err));
            }
        }

        // Specifies the text's language and translates it into a specific language
        if (command === "translate") {
            if (args.length < 3) {
                message.reply(speech.BOT_TRANS_SPECIFIC_ERROR);
            } else {
                let argFrom = args[0].toLowerCase();
                let argTo = args[1].toLowerCase();

                let lang_from = language.filter(ele => ele.name === argFrom)[0].abrv;
                let lang_to = language.filter(ele => ele.name=== argTo)[0].abrv;
                let text = args.slice(2).join(' ');

                translate(text, {from: lang_from, to: lang_to})
                    .then(res => message.channel.send(res.text))
                    //.catch(err => message.channel.send(speech.BOT_TRANSLATION_ERROR + err));
            }
        }

        if (command === "commands") {
            message.channel.send(speech.BOT_COMMANDS_HELP);
        }
    } else {
        if (!message.content.startsWith(Config.prefix) || message.author.bot) return;

        const args = message.content.slice(Config.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.login(Config.token);
