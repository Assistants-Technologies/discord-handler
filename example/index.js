const { CommandHandler, FunctionHandler, EventHandler } = require(`${__dirname}/../`);
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const cHandler = new CommandHandler(client);
cHandler.fetchCommands(`${__dirname}/commands`, true); // true = single folder (All commands in one folder)

const eHandler = new EventHandler(client);
eHandler.fetchEvents(`${__dirname}/events`, true); // true = single folder (All events in one folder)

const fHandler = new FunctionHandler(client);
fHandler.fetchFunctions(`${__dirname}/functions`, true); // true = single folder (All functions in one folder)

client.login('token');