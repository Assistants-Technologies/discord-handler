const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [ // The intents below only work on v14 of discord.js
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const { CommandHandler, EventHandler } = require('../../index'); // require the npm package instead
const commandHandler = new CommandHandler(client);
const eventHandler = new EventHandler(client);

commandHandler.fetchCommands({
    directory: `${__dirname}/commands`,
    singleFolder: true
});

eventHandler.fetchEvents({
    directory: `${__dirname}/events`,
    singleFolder: true
});

client.login('token');