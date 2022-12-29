module.exports = class EventHandler {
    /**
     * 
     * @param {*} client - discord.js client
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * @param {Object} options - Options for the event handler
     * @param {String} options.dir - Directory of events | Example: /events
     * @param {Boolean} options.singleFolder - If you have all events in one folder, set this to true.
     * 
     * @returns {void} - Returns nothing
     */
    fetchEvents({ directory, singleFolder = false }) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(directory)) {
            for (const file of readdirSync(`${directory}/${folder}`).filter(file => file.endsWith('.js'))) {
                const event = require(`${directory}/${folder}/${file}`);

                if (event.name && event.execute) this.client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(this.client, ...args));
                else require(`${__dirname}/index`).log(`Failed to load event: ${event.name} - Missing name or execute function.`);
            }
        } else for (const file of readdirSync(directory).filter(file => file.endsWith('.js'))) {
            const event = require(`${directory}/${file}`);

            if (event.name && event.execute) this.client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(this.client, ...args));
            else require(`${__dirname}/index`).log(`Failed to load event: ${event.name} - Missing name or execute function.`);
        }
    }
}