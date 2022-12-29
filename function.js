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
     * @param {String} dir - Directory of functions | Example: /functions
     * @param {Boolean} singleFolder - If you have all functions in one folder, set this to true.
     * @param {Boolean} useAlt - If you want functions to be assigned to client.functions instead of client, set this to true.
     * @param {Boolean} useFolder - If you want functions to be assigned to client.[folder] instead of client, set this to true. (useAlt makes it client.functions.[folder]) | Doesn't work for singleFolder.
     */
    fetchFunctions(dir, singleFolder = false, useAlt = false, useFolder = false) {
        const { readdirSync } = require('fs');

        if (!singleFolder) for (const folder of readdirSync(dir)) {
            for (const file of readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'))) {
                const func = require(`${dir}/${folder}/${file}`);
                func.name = f.replace('.js', '');
                func.options = {
                    path: `${dir}/${folder}/${file}`,
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
        } else for (const file of readdirSync(dir).filter(file => file.endsWith('.js'))) {
            const func = require(`${dir}/${file}`);
            func.name = file.replace('.js', '');
            func.options = {
                path: `${dir}/${file}`,
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
     * @param {String} f - Function name
     * @param {Boolean} findSpecific - If you want to get a specific function by folder, set this to true.
     * @param {String} folder - Folder name
     */
    reloadFunction(f, findSpecific = false, folder = null) {
        if (!f) return { error: 'Function name not provided' };
        if (findSpecific && !folder) return { error: 'Folder name not provided' };

        let func = this.client.functionList.get(findSpecific ? `${folder}/${f}` : f);
        if (!func) return { error: 'Function not found' };
        func.name = f.replace('.js', '');

        delete require.cache[require.resolve(func.options.path)];

        try {
            const f = require(func.path);

            if(func.options.singleFolder) {
                if (func.options.useAlt) this.client.functions[func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);
                else this.client[func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);
            } else if(func.options.useAlt && !func.options.useFolder) this.client.functions[func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);
            else if(func.options.useAlt && func.options.useFolder) {
                if (!this.client.functions[folder]) this.client.functions[folder] = [];
                this.client.functions[folder][func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);
            } else if(func.options.useFolder) this.client[folder][func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);
            else this.client[func.name.toLowerCase()] = async (...args) => f.execute(this.client, ...args);

            return { success: true, error: false };
        } catch (error) {
            return { error: error.message }
        }
    }
}