module.exports = class EventHandler {
    /**
     * 
     * @param {*} client - discord.js client
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * 
     * @param {String} dir - Directory of events | Example: /events
     * @param {Boolean} singleFolder - If you have all events in one folder, set this to true.
     */
    fetchEvents(dir, singleFolder = false) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(dir)) {
            for (const file of readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'))) {
                const event = require(`${dir}/${folder}/${file}`);

                if (event.name && event.execute) this.client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args, this.client));
                else require(`${__dirname}/index`).log(`Failed to load event: ${event.name} - Missing name or execute function.`);
            }
        } else for (const file of readdirSync(dir).filter(file => file.endsWith('.js'))) {
            const event = require(`${dir}/${file}`);

            if (event.name && event.execute) this.client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args, this.client));
            else require(`${__dirname}/index`).log(`Failed to load event: ${event.name} - Missing name or execute function.`);
        }
    }
}