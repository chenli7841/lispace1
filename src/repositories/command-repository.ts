import {CommandText} from "../services/command-service";

export const getCommandHistory = (): CommandText[] => {
    return JSON.parse(window.localStorage['commandHistory'] || '[]');
};

let nextIndex = getCommandHistory().length + 1;

export const addCommand = (commandText: CommandText) => {
    const commandHistory = JSON.parse(window.localStorage['commandHistory'] || '[]') || [];
    commandHistory.push({...commandText, id: nextIndex} as CommandText);
    window.localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
    nextIndex++;
};