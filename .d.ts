declare module 'discord-multi-handler' {
    import { Collection, Command } from 'discord.js';

    export class CommandHandler {
        constructor(client: any);

        fetchCommands: (options: {
            directory: string
            singleFolder?: boolean
        }) => Collection<string, Command>

        addCommand: (path: string) => void

        reloadCommand: (cmd: string) => {
            success: boolean,
            error: string | false
        }
    }

    export class EventHandler {
        constructor(client: any)

        fetchEvents: (options: {
            directory: string
            singleFolder?: boolean
        }) => void
    }

    export class FunctionHandler {
        constructor(client: any)

        fetchFunctions: (options: { 
            directory: string
            singleFolder?: boolean 
            useAlt?: boolean 
            useFolder?: boolean  
        }) => void

        reloadFunction: (options: { 
            func: string 
            findSpecific?: boolean
            folder?: string
        }) => {
            success: boolean,
            error: string | false
        }
    }

    export function log(msg: string): void
}