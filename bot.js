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

        //command "session .."
	    case "session":
	    case "s":

	        switch (args[1]) {
	            
	            //command "session start (game)"
	            case 'start':
	            case 's':

	                //check length
	                if (args.length >= 2) {

	                    //get args
	                    var currentGame = new getGame(args[2]);

	                    //check valid game
	                    if (currentGame.valid == false) {
	                        message.channel.send('This is not a valid game');
	                        return;
	                    }

	                    //get other variables
	                    var currentSessionNumber = sessionCounter;
	                    session[currentSessionNumber] = {
	                        id: 0,
	                        playersList: [],
	                        Game: currentGame,
	                        host: message.author,
	                        number: currentSessionNumber,
	                        channel: {
	                            category: {},
	                            text: {},
	                            voice: {}

	                        }
	                    }

	                    //make Embed
	                    var sessionEmbed = getSessionEmbed(session[currentSessionNumber]);

	                    //send to session channel
	                    var messageSession = bot.channels.get('396650049314095104').send(sessionEmbed)
                        .then(function (newMessage) {
                            newMessage.react(':join:396981957042372610');
                            session[currentSessionNumber].id = newMessage.id;
                        });

	                    //create new channels
	                    createSessionChannel(message.guild, currentSessionNumber);

	                    sessionCounter++;
	                    message.delete();

	                }
	                else {
	                    //fails if too few arguments
	                    message.channel.send('Too few arguments');
	                }

	            break;
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
        if (!user.equals(bot.user)) {

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

                    //it exists
                    exists = true;

                    break;
                }
            }

            //do if it doesnt exist
            if (exists == false) {

                //add player to list
                session[currentSession].playersList[session[currentSession].playersList.length] = user.username;

                console.log(reaction.message.guild.members.get(user.id));

                //give role
                reaction.message.guild.members.get(user.id).addRole(session[currentSession].channel.role.id);

                //update message
                reaction.message.edit(getSessionEmbed(session[currentSession]));
            }
            
        }
    }

});

function getGame(game) {

    //check which game
    switch (game) {

        //if rainbow six siege
        case "rb6":
            
            //info about rb6
            this.name = "Rainbow Six Siege";
            this.description = "This is a first person shooter with 2 team where you have to accomplish a objective like rescueing a hostage or securing the container."
            this.thumbnail = "https://github.com/cyborggeneraal/googleAlex/blob/master/rb6.png?raw=true";
            this.valid = true;

        break;

        //if civilization VI
        case "civ6":

            //info about rb6
            this.name = "Civilization VI";
            this.description = "This is a turn-based strategy game where you have to lead the best civilization from the stone age to the future.";
            this.thumbnail = "https://github.com/cyborggeneraal/googleAlex/blob/master/civ6.png?raw=true";
            this.valid = true;

        break;

        //if it is a game not from this list
        default:
            
            //this is no valid game
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
        return 'No players have joined';
    }
}

function getSessionEmbed(currentSession) {

    //make embed
    var embed =
    {
        embed: {
                color: 3447003,
                title: "**session " + currentSession.number.toString() + "**",
                thumbnail: {
                url: currentSession.Game.thumbnail
                },
            author: {
                name: currentSession.host.username
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

function createSessionChannel(server, sessionNumber) {

    server.createRole({
        data: {
            name: 'session ' + session[sessionNumber].number.toString()
        }
    })
    .then(newRole => {

        session[sessionNumber].channel.role = newRole;

        //create category
        server.createChannel('session ' + session[sessionNumber].number.toString(), {
            type: 'category',
            overwrites: [{
                //deny viewing the channel
                deny: 0x00000400,
                //@everyone
                id: '363447397763776512'
            },
            {
                //allow viewing the channel
                allow: 0x00000400,
                //session role
                id: session[sessionNumber].channel.role.id,
            }]
        })
        .then((newChannel) => {

            //get the channel itself if created
            session[sessionNumber].channel.category = newChannel;

            //create text channel
            server.createChannel('session' + session[sessionNumber].number.toString(), { type: 'text', parent: session[sessionNumber].channel.category.id })
            .then((newChannel) => {

                //get the channel itself if created
                session[sessionNumber].channel.text = newChannel;

            });

            //create voice channel
            server.createChannel('session ' + session[sessionNumber].number.toString(), { type: 'voice', parent: session[sessionNumber].channel.category.id })
            .then((newChannel) => {

                //get the channel itself if created
                session[sessionNumber].channel.voice = newChannel;

            });

        })
        .catch(
            (err) => {
                console.log('But he has promised it');
            }
        );
    })
    
}

bot.login("Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M");
