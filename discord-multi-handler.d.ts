declare module 'discord-multi-handler' {
    import { Collection, Client } from "discord.js";

    export class CommandHandler {
        constructor(client: Client);

        fetchCommands: (options: {
            directory: string
            singleFolder?: boolean
        }) => Collection<string, Record<string, any>>;

        addCommand: (path: string) => void;

        reloadCommand: (cmd: string) => {
            success: boolean,
            error: string | false
        }
    }

    export class EventHandler {
        constructor(client: Client);

        fetchEvents: (options: {
            directory: string
            singleFolder?: boolean
        }) => void;
    }

    export class FunctionHandler {
        constructor(client: Client);

        fetchFunctions: (options: { 
            directory: string
            singleFolder?: boolean 
            useAlt?: boolean 
            useFolder?: boolean  
        }) => void;

        reloadFunction: (options: { 
            func: string 
            findSpecific?: boolean
            folder?: string
        }) => {
            success: boolean,
            error: string | false
        };
    }

    export function log(message: string): void;
}