export interface File {
    title: string,
    paragraphs: string[]
}

export const getFileNames = (): string[] => {
    return getFileKeys()
        .map((fileName: string) => fileName.replace('file_', ''));
};

export const getFileKeys = (): string[] => {
    return JSON.parse(window.localStorage['fileNames'] || '[]');
};

export const addNewFile = (file: File) => {
    const fileNames = getFileKeys();
    if (fileNames.indexOf('file_' + file.title) >= 0) {
        console.error(`Error: File ${file.title} exists already.`);
        return;
    }
    fileNames.push('file_' + file.title);
    window.localStorage.setItem('fileNames', JSON.stringify(fileNames));
    window.localStorage.setItem('file_' + file.title, JSON.stringify(file.paragraphs));
};

export const getFileContent = (fileName: string): string[] | undefined => {
    const file = window.localStorage.getItem('file_' + fileName);
    if (file) {
        return JSON.parse(file) as string[];
    } else {
        return undefined;
    }
};

export const updateFileContent = (fileName: string, content: string[]): string[] | undefined => {
    const file = window.localStorage.getItem('file_' + fileName);
    if (file) {
        window.localStorage.setItem('file_' + fileName, JSON.stringify(content));
        return content;
    } else {
        return undefined;
    }
};