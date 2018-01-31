const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = "Mzc1NzMyNzk4NTYxOTc2MzIx.DSkE8Q.buM5jfaUxEeKICAcSwMOPrBH30M";
const PREFIX = ">";

let sessionCounter = 1;

const sessionChannelID = '401388480225214465';
const botChannelID = '401387316981006337';

const everyoneID = '401385630686511104';

let session = [];
let pushedArray = {theArray: []};

const deleteTime = 6 * 1000;

const help = {

    list: [{

        command: 'ping',
        name: PREFIX + 'ping',
        value: 'test if the bot react correctly.'

    },
    {

        command: 'boe',
        name: PREFIX + 'boe',
        value: 'test if the bot can scare.'

    },
    {
        command: 'session',
        name: PREFIX + 'session ..',
        value: "for creating/modyfing sessions. type '" + PREFIX + "session help' for more info.",

        list: [{

            command: 'start',
            name: PREFIX + 'session start <game>',
            value: 'starts a session.'

        },
        {

            command: 'end',
            name: PREFIX + 'session end [session number]',
            value: "end session. if you send this in the channel of the session you don't need a number."

        },
        {

            command: 'games',
            name: PREFIX + 'session games ..',
            value: "for viewing/modyfing games for session. type '" + PREFIX + "session games help' for more info.",

            list: [{

                command: 'list',
                name: PREFIX + 'session games list',
                value: "for viewing avaible games."
            }]

        }]

    }]
};

const games = [
    {
        code: 'rb6',
        name: "Rainbow Six Siege",
        description: "This is a first person shooter with 2 team where you have to accomplish a objective like rescueing a hostage or securing the container.",
        thumbnail: "https://github.com/cyborggeneraal/googleAlex/blob/master/rb6.png?raw=true"
    },
    {
        code: 'civ6',
        name: "Civilization VI",
        description: "This is a turn-based strategy game where you have to lead the best civilization from the stone age to the future.",
        thumbnail: "https://github.com/cyborggeneraal/googleAlex/blob/master/civ6.png?raw=true"
    }];

bot.on('message', (message) => {

    //fails if send by the bot
    if (message.author.equals(bot.user)) {
        return;
    }

    //fails if it hasn't the right prefix
    if (!message.content.startsWith(PREFIX)) return;

    //get the args
    var args = message.content.substring(PREFIX.length).split(" ");

    if (args[args.length - 1] == 'help') {

        var currentHelp = help;

        for (var i = 0; i < args.length; i++) {

            var exists = false;
            
            //find there is another list left
            if (typeof currentHelp.list != 'undefined') {

                //find which group you need
                for (var j = 0; j < currentHelp.list.length; j++) {
                    
                    //test if this is the one
                    if (currentHelp.list[j].command == args[i]) {
                        
                        //go in this group
                        currentHelp = currentHelp.list[j];
                        
                        var exists = true;

                        //do it for next arg
                        break;

                    }
                }

                //check if something found
                if (exists == false) {

                    //end this loop
                    break;

                }
            }
            else {
                
                //break loop
                break;

            }
            
        }

        deleteSentMessage(message);
        
        message.channel.send("The help will be sent to you.")
            .then((sentMessage) => {
                sentMessage.delete({ timeout: deleteTime });
            });
        
        var helpList = [];
        
        //check if it is an array
        if (typeof currentHelp.list !== 'undefined') {
            
            //put object in array
            for (var i = 0; i < currentHelp.list.length; i++) {
                
                //make help list
                helpList.push({
                    name: currentHelp.list[i].name,
                    value: currentHelp.list[i].value
                });

            }

        }
        else {

            //make help list
            helpList = [{
                name: currentHelp.name,
                value: currentHelp.value
            }]
        }
        
        //send help list
        sendHelpEmbed(helpList, message);
        
    }
    else {

        switch (args[0]) {

                //command "ping"
            case "ping":

                //check length
                if (args.length == 1) {

                    //say pong
                    message.channel.send('pong');

                }
                else {

                    //say it has to many arguments
                    message.channel.send("It has to many arguments. Type '" + PREFIX + "ping help' for more information")
                    .then((sentMessage) => {
                        sentMessage.delete({ timeout: deleteTime });
                    });

                    deleteSentMessage(message);

                }

                break;

                //command "boe"
            case "boe":

                //check length
                if (args.length == 1) {

                    //say schrik
                    message.channel.send('schrik');

                }
                else {

                    //say it has to many arguments
                    message.channel.send("It has to many arguments. Type '" + PREFIX + "boe help' for more information")
                    .then((sentMessage) => {
                        sentMessage.delete({ timeout: deleteTime });
                    });

                    deleteSentMessage(message);

                }

                break;

                //command "session .."
            case "session":
            case "s":

                    switch (args[1]) {

                        //command "session start (game)"
                        case 'start':
                        case 's':

                            //check it is in the right channel
                            if (message.channel.id == botChannelID) {

                                //check length
                                if (args.length == 3) {

                                    var exists = false;

                                    //check if the host has already a session
                                    for (var i = 1; i < session.length; i++) {

                                        //check session exists
                                        if (session[i] != null) {

                                            //check it is his
                                            if (session[i].host.id == message.author.id) {

                                                exists = true;

                                                message.channel.send("You can't host more than 1 session.")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                                break;

                                            }

                                        }

                                    }

                                    if (exists == false) {

                                        //get args
                                        var currentGame = new getGame(args[2]);
                                        
                                        //check valid game
                                        if (currentGame.valid == false) {

                                            message.channel.send("This is not a valid game. Type '" + PREFIX + "session games list' for more info.")
                                            .then((sentMessage) => {
                                                sentMessage.delete({ timeout: deleteTime });
                                            });

                                            break;
                                        }

                                        //get other variables
                                        var currentSessionNumber = sessionCounter;
                                        session[currentSessionNumber] = {
                                            message: {},
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
                                        var messageSession = bot.channels.get(sessionChannelID).send(sessionEmbed)
                                        .then(function (newMessage) {
                                            newMessage.react(':join:401389034145972224');
                                            session[currentSessionNumber].message = newMessage;
                                        });

                                        //create new channels
                                        createSessionChannel(message.guild, currentSessionNumber);

                                        sessionCounter++;

                                        //say session will be created
                                        message.channel.send("The session will be created")
                                        .then((sentMessage) => {
                                            sentMessage.delete({ timeout: deleteTime });
                                        });

                                    }

                                }
                                else {
                                    
                                    //fails if too few arguments
                                    message.channel.send("This command is invalid. type '" + PREFIX + "session start help' for more info.")
                                    .then((sentMessage) => {
                                        
                                        sentMessage.delete({ timeout: deleteTime });
                                        
                                    });
                                    
                                }
                            }
                            else {

                                //say it needs to send to #bot
                                message.channel.send("Send this to #bot")
                                        .then((sentMessage) => {
                                            
                                            sentMessage.delete({ timeout: deleteTime });
                                            
                                        });

                            }
                            
                            break;

                            //command "session end (session number)"
                        case "end":
                        case "e":

                            //check does it have args[2]
                            if (args.length == 2) {
                                
                                //check if it is in a session channel
                                var currentSessionNumber = 0;
                                for (var i = 1; i < session.length; i++) {

                                    //test if the session exists
                                    if (session[i] != null) {

                                        //compare the id of the message and the channel
                                        if (message.channel.id == session[i].channel.text.id) {

                                            currentSessionNumber = i;
                                            break;

                                        }

                                    }

                                }
                                

                                //check if it is in session channel
                                if (currentSessionNumber != 0) {

                                    //check if he is authorized
                                    if (message.author.id == '258251479410802690' || message.author.id == session[currentSessionNumber].host.id) {

                                        //delete this channel
                                        sessionEnd(session[currentSessionNumber]);

                                    }

                                }
                                else {

                                    if (message.channel.id == botChannelID) {

                                        //say you need a number
                                        message.channel.send("You need a number. type '" + PREFIX + "session help' for more info.")
                                        .then((sentMessage) => {
                                            sentMessage.delete({ timeout: deleteTime });
                                        });

                                    }
                                    else {

                                        //say to send this to #bot
                                        message.channel.send("Send this to #bot.")
                                        .then((sentMessage) => {
                                            sentMessage.delete({ timeout: deleteTime });
                                        });

                                    }
                                    

                                }
                                

                            }
                            else {

                                //check it is in the right channel
                                if (message.channel.id == botChannelID) {

                                    //check if it is a number
                                    if (isNaN(args[2])) {

                                        //check it is "all"
                                        if (args[2] == 'all' || args[2] == 'a') {

                                            //check if he is authorized
                                            if (message.author.id == '258251479410802690') {

                                                //do for each session
                                                for (var i = 1; i < session.length; i++) {

                                                    //end session
                                                    sessionEnd(session[i]);

                                                }

                                                //say all session will be ended
                                                message.channel.send("all sessions will be ended.")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                            } else {

                                                //say you dont have permission
                                                message.channel.send("You don't have permission to do this.")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                            }

                                        }
                                        else {

                                            //say command is invalid
                                            message.channel.send("This command is invalid. type '" + PREFIX + "session end help' for more info.")
                                            .then((sentMessage) => {
                                                sentMessage.delete({ timeout: deleteTime });
                                            });

                                        }
                                    }
                                    else {

                                        //check if this one exists
                                        if (session[args[2]] != null && typeof session[args[2]] != 'undefined') {

                                            //check if he is authorized
                                            if (message.author.id == '258251479410802690' || message.author.id == session[args[2]].host.id) {

                                                //end session
                                                sessionEnd(session[args[2]]);

                                                //say the session will be ended
                                                message.channel.send("The session will be ended")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                            }
                                            else {

                                                //say you have to be the host
                                                message.channel.send("You must be the host of the session")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                            }
                                        }
                                        else {

                                            //say the session doesn't exist
                                            message.channel.send("The session doesn't exists")
                                                .then((sentMessage) => {
                                                    sentMessage.delete({ timeout: deleteTime });
                                                });

                                        }

                                    }
                                }
                                else {

                                    //send to send this to #bot
                                    message.channel.send("Send this to #bot")
                                            .then((sentMessage) => {
                                                sentMessage.delete({ timeout: deleteTime });
                                            });

                                }

                            }

                            break;

                        //command "session games .."
                        case 'games':
                        case 'g':

                            switch (args[2]) {
                                
                                //command "session games list"
                                case 'list':
                                case 'l':

                                    if (args.length == 3) {

                                        var list = '';
                                        for (var i = 0; i < games.length; i++) {
                                            list += games[i].name + ' (' + games[i].code + ')\n';
                                        }

                                        message.channel.send("List of games will be sent.")
                                            .then((sentMessage) => {
                                                sentMessage.delete({ timeout: deleteTime });
                                            });

                                        //send embed list
                                        message.author.send({
                                            embed: {
                                                color: 3447003,
                                                title: 'list of games',
                                                thumbnail: {
                                                    url: ''
                                                },
                                                author: {
                                                    name: bot.username
                                                },
                                                fields: [{
                                                    name: 'Avaible games:',
                                                    value: list
                                                }]
                                            }
                                        });

                                    }
                                    else {

                                        //say the command is invalid
                                        message.channel.send("This command is invalid. type '" + PREFIX + "session games list help' for more info.")
                                            .then((sentMessage) => {
                                                sentMessage.delete({ timeout: deleteTime });
                                            });
                                    }
                                    

                                    break;

                                default:

                                    //say the command is invalid
                                    message.channel.send("This command is invalid. type '" + PREFIX + "session games help' for more info.")
                                    .then((sentMessage) => {
                                        sentMessage.delete({ timeout: deleteTime });
                                    });

                                    break;

                            }

                            break;

                        default:

                            //say you need to get help
                            message.channel.send("This command is invalid. type '" + PREFIX + "session help' for more info.")
                            .then((sentMessage) => {
                                sentMessage.delete({ timeout: deleteTime });
                            });

                            break;
                    }

                    deleteSentMessage(message);

                break;

                //unknown command
            default:

                //say the command is invalid
                message.channel.send("This command is invalid. type '" + PREFIX + "help' for more info.")
                    .then((sentMessage) => {
                        sentMessage.delete({ timeout: deleteTime });
                    });

                deleteSentMessage(message);

        }

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

                //check if the session exists
                if (session[i] != null) {

                    //check this one matches
                    if (session[i].message.id == reaction.message.id) {

                        //set currentSession
                        currentSession = i;

                        //end loop
                        break;
                    }

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

                //give role
                reaction.message.guild.members.get(user.id).addRole(session[currentSession].channel.role.id);

                //update message
                reaction.message.edit(getSessionEmbed(session[currentSession]));
            }
            
        }
    }

});

bot.on('messageReactionRemove', (reaction, user) => {
    
    //check reaction is from #session
    if (reaction.message.channel.name == "sessions") {
        
        //check it's from the bot itself or not
        if (!user.equals(bot.user)) {
            
            //check which session matches
            var currentSession = 1;
            for (var i = 1; i < session.length; i++) {
                
                //check if the session exists
                if (session[i] != null) {

                    //check this one matches
                    if (session[i].message.id == reaction.message.id) {

                        //set currentSession
                        currentSession = i;

                        //end loop
                        break;
                    }
                }
            }
            
            //remove name
            //go through all names
            for (var i = 0; i < session[currentSession].playersList.length; i++) {
                
                //check the name
                if (user.username = session[currentSession].playersList[i]) {
                    
                    //remove name
                    session[currentSession].playersList.splice(i, 1);

                }

            }
            
            //remove role
            reaction.message.guild.members.get(user.id).removeRole(session[currentSession].channel.role.id).catch(console.error);

            //update message
            reaction.message.edit(getSessionEmbed(session[currentSession]));
            
        }

    }

});

function getGame(game) {

    this.valid = false;
    
    //check which game
    for (var i = 0; i < games.length; i++) {
        
        //check if it is this one
        if (game == games[i].code) {
            
            //found it
            this.valid = true;

            break;
        }
    }
    
    if (this.valid == true) {

        //add all stuff he needs to know
        this.name = games[i].name;
        this.description = games[i].description;
        this.thumbnail = games[i].thumbnail;
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
                id: everyoneID
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

function sessionEnd(currentSession) {

    //check if the session exists
    if (currentSession != null) {

        //delete session message
        currentSession.message.delete()
        .then(() => {

            //delete role
            currentSession.channel.role.delete()
            .then(() => {

                //delete all channels
                currentSession.channel.text.delete()
                .then(() => {
                    currentSession.channel.voice.delete()
                    .then(() => {
                        currentSession.channel.category.delete()
                        .then(() => {

                            //clear current session
                            session[currentSession.number] = null;

                        });
                    });
                });
            });
            

        }

        );

    }
    
}

function deleteSentMessage(message) {

    //check if not private
    if (message.channel.type != 'dm')
        message.delete();

}

function sendHelpEmbed (info, message) {
    
    //build help
    var helpEmbed =
        {
            embed: {
                color: 3447003,
                title: 'help',
                thumbnail: {
                    url: 'https://github.com/cyborggeneraal/googleAlex/blob/master/questionmark.png?raw=true'
                },
                author: {
                    name: bot.username
                },
                fields: []
            }
        };
    
    //push everything in the help embed
    for (var i = 0; i < info.length; i++) {

        //push
        helpEmbed.embed.fields.push(info[i]);

    }
    
    //send help
    message.author.send(helpEmbed);

}

bot.login("NDAxNjc1MDk5OTg5NzM3NDcz.DTtozA.zqqQ1YLSyKmj32BAcoY0Miu6c1k");
