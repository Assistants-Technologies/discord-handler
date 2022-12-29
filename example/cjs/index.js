const { CommandHandler, FunctionHandler, EventHandler } = require('discord-multi-handler');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.handlers = {};
client.handlers.command = new CommandHandler(client);
client.handlers.command.fetchCommands({
    directory: `${__dirname}/commands`,
    singleFolder: true // true = single folder (All commands in one folder)
});

client.handlers.event = new EventHandler(client);
client.handlers.event.fetchEvents({
    directory: `${__dirname}/events`,
    singleFolder: true // true = single folder (All events in one folder)
});

client.handlers.function = new FunctionHandler(client);
client.handlers.function.fetchFunctions({
    directory: `${__dirname}/functions`,
    singleFolder: true // true = single folder (All functions in one folder)
});

client.login('');