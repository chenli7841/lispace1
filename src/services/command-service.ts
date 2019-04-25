import {addCommand, getCommandHistory} from "../repositories/command-repository";

export enum CommandType {
    CREATE,
    OPEN,
    EDIT,
    SETWIDTH,
    SETHEIGHT,
    UNKNOWN
}

export interface Command {
    type: CommandType,
    args: any;
}

export interface CommandText {
    id: number,
    text: string
}

export const parseCommand = (command: string): Command => {
    let trimmed = command.trim();
    if (trimmed.indexOf("Create ") === 0) {
        const fileName = trimmed.split(' ')[1];
        return { type: CommandType.CREATE, args: { fileName: fileName} }
    } else if (trimmed.indexOf("Open ") === 0) {
        const fileName = trimmed.split(' ')[1];
        return { type: CommandType.OPEN, args: { fileName: fileName} }
    } else if (trimmed.indexOf("Edit ") === 0) {
        const fileName = trimmed.split(' ')[1];
        return { type: CommandType.EDIT, args: { fileName: fileName} }
    } else if (trimmed.indexOf("Set width ") === 0) {
        const width = trimmed.replace('Set width ', '').trim();
        return { type: CommandType.SETWIDTH, args: { width: width }};
    } else if (trimmed.indexOf("Set height ") === 0) {
        const height = trimmed.replace('Set height ', '').trim();
        return { type: CommandType.SETHEIGHT, args: { height: height }};
    }
    return { type: CommandType.UNKNOWN, args: undefined };
};

const commandSubscribers: Array<(command: Command) => any> = [];
const commandHistorySubscribers: Array<(commandHistory: CommandText[]) => any> = [];

export const subscribeToCommand = (subscriber: (command: Command) => any) => {
    commandSubscribers.push(subscriber);
};

export const subscribeToCommandHistory = (subscriber: (commandHistory: CommandText[]) => any) => {
    commandHistorySubscribers.push(subscriber);
};

export const submitCommand = (command: string) => {
    addCommand(command);
    const parsedCommand: Command = parseCommand(command);
    commandSubscribers.forEach((subscriber: ((command: Command) => any)) => {
        subscriber(parsedCommand);
    });
    commandHistorySubscribers.forEach((subscriber: ((history: CommandText[]) => any)) => {
        const commandHistory = getCommandHistory();
        subscriber(commandHistory);
    });
};

export const getLastCommand = (): Command | undefined => {
    const commandHistory = getCommandHistory();
    if (getCommandHistory().length === 0) {
        return undefined;
    }
    return parseCommand(commandHistory[commandHistory.length - 1].text);
};