const { Collection } = require('discord.js');

module.exports = class FunctionHandler {
    /**
     * 
     * @param {} client - discord.js client
     */
    constructor(client) {
        this.client = client;
        this.client.functionList = new Collection();
        this.client.functions = [];
    }
    /**
     * 
     * @param {Object} options - Options for the function handler
     * @param {String} options.dir - Directory of functions | Example: /functions
     * @param {Boolean} options.singleFolder - If you have all functions in one folder, set this to true.
     * @param {Boolean} options.useAlt - If you want functions to be assigned to client.functions instead of client, set this to true.
     * @param {Boolean} options.useFolder - If you want functions to be assigned to client.[folder] instead of client, set this to true. (useAlt makes it client.functions.[folder]) | Doesn't work for singleFolder.
     */
    fetchFunctions({ directory, singleFolder = false, useAlt = false, useFolder = false }) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(directory)) {
            for (const file of readdirSync(`${directory}/${folder}`).filter(file => file.endsWith('.js'))) {
                const func = require(`${directory}/${folder}/${file}`);
                func.name = f.replace('.js', '');
                func.options = {
                    path: `${directory}/${folder}/${file}`,
                    singleFolder,
                    useAlt,
                    useFolder
                }
                if (func.name && func.execute) {
                    this.client.functionList.set(useFolder ? `${folder}/` : "" + func.name.toLowerCase(), func);
                    if (useAlt && !useFolder) this.client.functions[func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
                    else if (useAlt && useFolder) {
                        if (!this.client.functions[folder]) this.client.functions[folder] = [];
                        this.client.functions[folder][func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
                    } else if (useFolder) this.client[folder][func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
                    else this.client[func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
                } else require(`${__dirname}/index`).log(`Failed to load function: ${func.name} - Missing name or execute function.`);
            }
        } else for (const file of readdirSync(directory).filter(file => file.endsWith('.js'))) {
            const func = require(`${directory}/${file}`);
            func.name = file.replace('.js', '');
            func.options = {
                path: `${directory}/${file}`,
                singleFolder,
                useAlt,
                useFolder: false
            }

            if (func.name && func.execute) {
                if (useFolder) require(`${__dirname}/index`).log(`Warning: useFolder cannot be used with singleFolder on functions.`);

                this.client.functionList.set(func.name.toLowerCase(), func);
                if (useAlt) this.client.functions[func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
                else this.client[func.name.toLowerCase()] = async (...args) => func.execute(this.client, ...args);
            } else require(`${__dirname}/index`).log(`Failed to load function: ${func.name} - Missing name or execute function.`);
        }
    }
    /**
     * @param {Object} options - Options for the function handler
     * @param {String} options.func - Function name
     * @param {Boolean} options.findSpecific - If you want to get a specific function by folder, set this to true.
     * @param {String} options.folder - Folder name
     */
    reloadFunction({ func, findSpecific = false, folder = null }) {
        if (!func) return { error: 'Function name not provided', success: false };
        if (findSpecific && !folder) return { error: 'Folder name not provided', success: false };

        let f = this.client.functionList.get(findSpecific ? `${folder}/${f}` : f);
        if (!f) return { error: 'Function not found', success: false };
        f.name = f.replace('.js', '');

        delete require.cache[require.resolve(f.options.path)];

        try {
            const fnf = require(f.options.path);

            if (f.options.singleFolder) {
                if (f.options.useAlt) this.client.functions[f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);
                else this.client[f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);
            } else if (f.options.useAlt && !f.options.useFolder) this.client.functions[f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);
            else if (f.options.useAlt && f.options.useFolder) {
                if (!this.client.functions[folder]) this.client.functions[folder] = [];
                this.client.functions[folder][f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);
            } else if (f.options.useFolder) this.client[folder][f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);
            else this.client[f.name.toLowerCase()] = async (...args) => fnf.execute(this.client, ...args);

            return { success: true, error: false };
        } catch (error) {
            return { error: error.message, success: false }
        }
    }
}