import {getFileContent} from "./file-repository";

export interface Word {
    article: string,
    type: 'noun'|'verb'|'adjective',
    text: string | undefined,
    singular: string | undefined,
    plural: string | undefined
}

export interface Question {
    ask: string,
    answer: Word
}

let questions: Question[] = [];
let totalLength = questions.length;

export const loadDictionary = (fileName: string) => {
    const rows: string[] = getFileContent(fileName) || [];
    if (rows) {
        questions = rows.map(r =>{
            return JSON.parse(r);
        });
        totalLength = questions.length;
    } else {
        questions = [];
        totalLength = 0;
    }
};

export const getRandomQuestion = (): Question | undefined => {
    if (totalLength === 0) return undefined;
    const index = Math.floor(Math.random() * totalLength);
    console.log(index);
    if (index === totalLength) {
        return questions[index - 1];
    } else {
        return questions[index];
    }
};