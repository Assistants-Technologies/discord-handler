import { CommandHandler, FunctionHandler, EventHandler } from "../../index"; // require npm module instead, this example will not be able to access type declarations
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const commandHandler = new CommandHandler(client);
commandHandler.fetchCommands({
    directory: `./commands`,
    singleFolder: true // true = single folder (All commands in one folder)
});

const eventHandler = new EventHandler(client);
eventHandler.fetchEvents({
    directory: `./events`,
    singleFolder: true // true = single folder (All events in one folder)
});

const functionHandler = new FunctionHandler(client);
functionHandler.fetchFunctions({
    directory: `./functions`,
    singleFolder: true // true = single folder (All functions in one folder)
});

client.login('');

export default interface PlainStuff extends Client {
    commands: Collection<string, any>;
    functions: (...args: any) => any;
    // all your other properties

}