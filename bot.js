const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = "Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M";
const PREFIX = ">";

let sessionCounter = 1;

var sessionChannel = bot.channels.get('396650049314095104');

bot.on('message', (message) => {

    //fails if send by the bot
	if (message.author.equals(bot.user)) return;

    //fails if it hasn't the right prefix
	if (!message.content.startsWith(PREFIX)) return;

    //get the args
	var args = message.content.substring(PREFIX.length).split(" ");

	switch (args[0]) {

        //command "ping"
	    case "ping":

            //say pont
	        message.channel.send('pong');

			break;
        
        //command "boe"
	    case "boe":

            //say schrik
	        message.channel.send('schrik');

		break;

        //command "cool"
	    case "cool":

	        message.delete();

            //say I am cooler in session channel
	        var sendMessage = bot.channels.get('396650049314095104').sendMessage("I am cooler");

		break;

        //command "startsession (game)"
	    case "startsession":

            //check length
	        if (args.length >= 2) {

                //get args
	            var Game = new getGame(args[1]);

	            //check valid game
	            if (Game.valid == false) {
	                message.channel.send('This is not a valid game');
	                return;
	            }

                //get other variables
	            Host = message.author;

                //make Embed
	            var session =
                    {
                        embed: {
                            title: "**session " + sessionCounter.toString() + "**",
                            thumbnail: {
                                url: Game.thumbnail
                            },
                            author: {
                                name: message.author.username
                            },
                            fields: [{
                                name: Game.name,
                                value: Game.description
                            }]
                        }
                    };

                //send to session channel
	            session[sessionCounter] = bot.channels.get('396650049314095104').send(session);

	            message.delete();

			} 
	        else {
                //fails if too few arguments
				message.channel.send('Too few arguments');
			}

	    break;

        //unknown command
		default:
			message.channel.send("Google doesn't accept this command");

	}

});

function getGame(game) {

    switch (game) {

        case "rb6":
            this.name = "Rainbow Six Siege";
            this.description = "This is a first person shooter with 2 team where you have to accomplish a objective like rescueing a hostage or securing the container. <:join:396981957042372610>"
            this.thumbnail = "https://github.com/cyborggeneraal/googleAlex/blob/master/rb6.png?raw=true";
            this.valid = true;
        break;

        case "civ6":
            this.name = "Civilization VI";
            this.description = "This is a turn-based strategy game where you have to lead the best civilization from the stone age to the future.";
            this.thumbnail = "https://github.com/cyborggeneraal/googleAlex/blob/master/civ6.png?raw=true";
            this.valid = true;
        break;

        default:
            this.valid = false;
        break;
    }
}

bot.login("Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M");
