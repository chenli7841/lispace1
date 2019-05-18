export const isNumeric = (text: string|undefined) => {
    if (text === undefined) return false;
    return /^\d+$/.test(text);
}