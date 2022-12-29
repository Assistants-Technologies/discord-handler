const { Collection } = require('discord.js');

module.exports = class CommandHandler {
    /**
     * 
     * @param {*} client - discord.js client
     */
    constructor(client) {
        this.client = client;
        this.client.commands = new Collection();
    }
    /**
     * @param {Object} options - Options for the command handler
     * @param {String} options.directory - Directory of commands | Example: /commands 
     * @param {Boolean} options.singleFolder - If you have all commands in one folder, set this to true.
     * 
     * @returns {Collection} - Returns a collection of commands
     */
    fetchCommands({ directory, singleFolder = false }) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(directory)) {
            for (const file of readdirSync(`${directory}/${folder}`).filter(file => file.endsWith('.js'))) {
                const cmd = require(`${directory}/${folder}/${file}`);
                cmd.path = `${directory}/${folder}/${file}`;

                if (cmd.name && cmd.execute) this.client.commands.set(cmd.name.toLowerCase(), cmd);
                else require(`${__dirname}/index`).log(`Failed to load command: ${cmd.name} - Missing name or execute function.`);
            }
        }
        else for (const file of readdirSync(directory).filter(file => file.endsWith('.js'))) {
            const cmd = require(`${directory}/${file}`);
            cmd.path = `${directory}/${file}`;

            if (cmd.name && cmd.execute) this.client.commands.set(cmd.name.toLowerCase(), cmd);
            else require(`${__dirname}/index`).log(`Failed to load command: ${cmd.name} - Missing name or execute function.`);
        }

        return this.client.commands;
    }
    /**
     * 
     * @param {String} path - The command path | Example: /commands/ping.js
     * 
     */
    addCommand(path) {
        const cmd = require(path);

        if (cmd.name && cmd.execute) this.client.commands.set(cmd.name, cmd);
        else require(`${__dirname}/index`).log(`Failed to load command: ${cmd.name} - Missing name or execute function.`);
    }
    /**
     * 
     * @param {String} cmd - Command name
     * 
     */
    reloadCommand(cmd) {
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.find((c) => c.aliases && c.aliases.includes(cmd.toLowerCase()));

        if (!command) return { error: 'Command not found', success: false };

        delete require.cache[require.resolve(command.path)];

        try {
            const c = require(command.path);

            if (c.name && c.execute) {
                this.client.commands.set(c.name, c);

                return { success: true, error: false };
            } else return { error: 'Command is missing name or execute function', success: false };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}