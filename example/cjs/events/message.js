module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if(!message.content || !message.content.startsWith("!")) return;

        const args = message.content.slice(1).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        
        if (!command) return;
        
        command.execute(client, message, args);
    }
}