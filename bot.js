const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = "Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M";
const PREFIX = ">";

let sessionCounter = 1;

var sessionChannel = '396650049314095104';

let session = [];

bot.on('message', (message) => {

    //fails if send by the bot
    if (message.author.equals(bot.user)) {
        //console.log(getMessage(bot.channels.get(sessionChannel), message.id));
        return;
    }

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
	    case "ss":

            //check length
	        if (args.length >= 2) {

	            //get args
	            var currentGame = new getGame(args[1]);

	            //check valid game
	            if (currentGame.valid == false) {
	                message.channel.send('This is not a valid game');
	                return;
	            }

	            //get other variables
	            console.log(session);
	            session[sessionCounter] = {
	                id: 0,
	                playersList: [],
	                Game: currentGame,
	                host: message.author
	            }

	            //make Embed
	            var sessionEmbed = getSessionEmbed(session[sessionCounter]);

	            //send to session channel
	            var messageSession = bot.channels.get('396650049314095104').send(sessionEmbed)
                .then(function (message) {
                    message.react(':join:396981957042372610')
                });

	            sessionCounter++;
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

bot.on("messageReactionAdd", (reaction, user) => {

    //check reaction from is from #session
    if (reaction.message.channel.name == "sessions") {

        //check it's from the bot itself or not
        if (user.equals(bot.user)) {
            //set the session properties

            //get the session number
            var currentSession = sessionCounter - 1;

            //add new properties
            session[currentSession].id = reaction.message.id;

        } else {
            //check which session matches
            var currentSession = 1;
            for (var i = 1; i < session.length; i++) {

                //check this one matches
                if (session[i].id == reaction.message.id) {
                    //set currentSession
                    currentSession = i;
                    
                    //end loop
                    break;
                }
            }

            //check the name already exist
            var exists = false;
            for (var i = 0; i < session[currentSession].playersList.length; i++) {
                if (user.username == session[currentSession].playersList[i]) {
                    exists = true;
                    break;
                }
            }
            //add to players list if it doesnt exist
            if (exists == false) {
                //add player to list
                session[currentSession].playersList[session[currentSession].playersList.length] = user.username;

                //update message
                reaction.message.edit(getSessionEmbed(session[currentSession]));
            }
        }
    }

});

function getGame(game) {

    switch (game) {

        case "rb6":
            this.name = "Rainbow Six Siege";
            this.description = "This is a first person shooter with 2 team where you have to accomplish a objective like rescueing a hostage or securing the container."
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

function setPlayersList(currentSession) {

    //check if there are any players joined
    if (currentSession.playersList.length > 0) {

        //start with the list
        var list = currentSession.playersList[0].toString();

        //add every player to the list
        for (i = 1; i < currentSession.playersList.length; i++) {
            list += "\n" + currentSession.playersList[i].toString();
        }

        //return the list
        return list;
    }
    else {

        //return there are no players joined
        return 'No players has joined';
    }
}

function getSessionEmbed(currentSession) {
    var embed =
    {
        embed: {
                color: 3447003,
                title: "**session " + sessionCounter.toString() + "**",
                thumbnail: {
                url: currentSession.Game.thumbnail
                },
            author: {
               name: 'host'
            },
            fields: [{
                name: currentSession.Game.name,
                value: currentSession.Game.description
            },
            {
                name: 'List of players',
                value: setPlayersList(currentSession)
            }]
        }
    };
    return embed;
}

bot.login("Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M");
