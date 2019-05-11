import {addCommand, getCommandHistory} from "../repositories/command-repository";

export enum CommandType {
    CREATE,
    OPEN,
    EDIT,
    SETWIDTH,
    SETHEIGHT,
    LISTFILES,
    CLOSE,
    HIDEHISTORY,
    SHOWHISTORY,
    GOTO,
    NEXTIMAGE,
    UNKNOWN
}

export interface Command {
    type: CommandType,
    args: any;
}

export interface CommandText {
    id: number,
    type: 'command' | 'response',
    text: string
}

export const parseCommand = (command: string): Command => {
    let trimmed = command.trim();
    if (trimmed.indexOf("Create ") === 0) {
        const fileName = trimmed.split(' ')[1];
        if (fileName.indexOf('.') >= 0) {
            const ext = fileName.split('.')[1];
            if (ext !== '') {
                return { type: CommandType.CREATE, args: { fileName: fileName, ext: ext } }
            }
        }
        return { type: CommandType.CREATE, args: { fileName: fileName } }
    } else if (trimmed.indexOf("Open ") === 0) {
        const fileName = trimmed.split(' ')[1];
        if (fileName.indexOf('.') >= 0) {
            const ext = fileName.split('.')[1];
            if (ext !== '') {
                return { type: CommandType.OPEN, args: { fileName: fileName, ext: ext } }
            }
        }
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
    } else if (trimmed === "List file names") {
        return { type: CommandType.LISTFILES, args: undefined };
    } else if (trimmed === "Close") {
        return { type: CommandType.CLOSE, args: undefined };
    } else if (trimmed === "Hide history") {
        return { type: CommandType.HIDEHISTORY, args: undefined };
    } else if (trimmed === "Show history") {
        return { type: CommandType.SHOWHISTORY, args: undefined };
    } else if (trimmed.indexOf("Go to ") === 0) {
        const place = trimmed.replace("Go to ", "").trim();
        return { type: CommandType.GOTO, args: place };
    } else if (trimmed === 'Next') {
        return { type: CommandType.NEXTIMAGE, args: undefined };
    }
    return { type: CommandType.UNKNOWN, args: undefined };
};

export const sampleCommand = [
    'Create fileOne',
    'Open fileOne',
    'Edit fileOne',
    'Set width 500',
    'Set height 500',
    'List file names',
    'Close',
    'Hide history',
    'Show history',
    'Go to Hamburg'
];

const commandSubscribers: Array<(command: Command) => any> = [];
const commandHistorySubscribers: Array<(commandHistory: CommandText[]) => any> = [];

export const subscribeToCommand = (subscriber: (command: Command) => any) => {
    commandSubscribers.push(subscriber);
};

export const subscribeToCommandHistory = (subscriber: (commandHistory: CommandText[]) => any) => {
    commandHistorySubscribers.push(subscriber);
};

export const submitCommand = (command: CommandText) => {
    const parsedCommand: Command = parseCommand(command.text);
    if (parsedCommand.type !== CommandType.NEXTIMAGE) {
        addCommand(command);
    }
    if (command.type === 'response') return;
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