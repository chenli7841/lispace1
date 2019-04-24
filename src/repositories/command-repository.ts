import {CommandText} from "../services/command-service";

export const getCommandHistory = (): CommandText[] => {
    return JSON.parse(window.localStorage['commandHistory'] || '[]');
};

let nextIndex = getCommandHistory().length + 1;

export const addCommand = (commandText: string) => {
    const commandHistory = JSON.parse(window.localStorage['commandHistory'] || '[]') || [];
    commandHistory.push({text: commandText, id: nextIndex} as CommandText);
    window.localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
    nextIndex++;
};