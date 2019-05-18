export interface VerseNote {
    chapter: number | undefined,
    verse: number | undefined,
    text: string,
    notes: string[]
}

export const setVerseNotesStore = (file: string, notes: VerseNote[]) => {
    window.localStorage.setItem('file_' + file, JSON.stringify(notes));
};

export const getVerseNotesStore = (file: string): VerseNote[] => {
    return JSON.parse(window.localStorage.getItem('file_' + file)!);
};