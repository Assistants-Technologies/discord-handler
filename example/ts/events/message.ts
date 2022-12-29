import { Message } from "discord.js";
import Client from "../"

export default {
    name: 'messageCreate',
    execute(client: Client, message: Message) {
        if(!message.content || !message.content.startsWith("!")) return;

        const args = message.content.slice(1).split(/ +/);
        const commandName = args?.shift()?.toLowerCase();

        if (!commandName) return;
        const command = client.commands.get(commandName);
        
        if (!command) return;
        
        command.execute(client, message, args);
    }
}