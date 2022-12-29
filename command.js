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
     * 
     * @param {String} dir - Directory of commands | Example: /commands 
     * @param {Boolean} singleFolder - If you have all commands in one folder, set this to true.
     */
    fetchCommands(dir, singleFolder = false) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(dir)) {
            for (const file of readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'))) {
                const cmd = require(`${dir}/${folder}/${file}`);
                cmd.path = `${dir}/${folder}/${file}`;

                if (cmd.name && cmd.execute) this.client.commands.set(cmd.name.toLowerCase(), cmd);
                else require(`${__dirname}/index`).log(`Failed to load command: ${cmd.name} - Missing name or execute function.`);
            }
        }
        else for (const file of readdirSync(dir).filter(file => file.endsWith('.js'))) {
            const cmd = require(`${dir}/${file}`);
            cmd.path = `${dir}/${file}`;

            if (cmd.name && cmd.execute) this.client.commands.set(cmd.name.toLowerCase(), cmd);
            else require(`${__dirname}/index`).log(`Failed to load command: ${cmd.name} - Missing name or execute function.`);
        }
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
        const command = client.commands.get(cmd?.name?.toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(cmd.name.toLowerCase()));

        if (!command) return { error: 'Command not found' };

        delete require.cache[require.resolve(command.path)];

        try {
            const c = require(command.path);

            if(c.name && c.execute) {
                client.commands.set(c.name, c);

                return { success: true, error: false };
            } else return { error: 'Command is missing name or execute function' };
        } catch (error) {
            return { error: error.message }
        }
    }
}