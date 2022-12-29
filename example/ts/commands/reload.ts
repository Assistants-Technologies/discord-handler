export default {
    name: 'reload',
    execute: (client, message, args) => {
        if(!args[0]) return message.reply({ content: "Please provide a command to reload!" });

        const commandName = args[0].toLowerCase();
        const reload = client.handlers.command.reloadCommand(commandName);

        if(reload.error) return message.reply({ content: reload.error });
        else message.reply({ content: `Successfully reloaded command: ${commandName}` });
    }
}