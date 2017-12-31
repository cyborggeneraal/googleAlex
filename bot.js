const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = "Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M";
const PREFIX = ">";

var sessionChannel = bot.channels.get('396650049314095104');

bot.on('message', (message) => {

	if (message.author.equals(bot.user)) return;

	if (!message.content.startsWith(PREFIX)) return;

	var args = message.content.substring(PREFIX.length).split(" ");

	switch (args[0]) {
		case "ping":
			message.channel.send('pong');
		break;

		case "boe":
			message.channel.send('schrik');
		break;

		case "cool":
			var sendMessage = bot.channels.get('396650049314095104').sendMessage("I am cooler");
		break;

		case "remove":
			message.delete(1000);
		break;

		case "startsession":
			if (args.length >= 2) {
				Game = args[1];
				Description = "Some description";
				var session = new Discord.RichEmbed()
					.addField(Game, Description)
				message.channel.send(session);
			} 
			else {
				message.channel.send('Too few arguments');
			}

		break;

		default:
			message.channel.send("Google doesn't accept this command");

	}

});

bot.login("Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M");
