import {Command} from "../services/command-service";

export interface Dimension {
    width: number | undefined,
    height: number | undefined,
    left: number | undefined,
    top: number | undefined
}

interface DimensionMap {
    [key: string]: Dimension | undefined
}

const map: DimensionMap = {};
const dimensionKeys = [
    'dim_command-dialog',
    'dim_html-editor',
    'dim_word-card-editor'
];

const defaultMap: DimensionMap = {
    'dim_command-dialog': { top: undefined, left: undefined, width: 400, height: undefined },
    'dim_html-editor': { top: 40, left: 40, width: 400, height: 650 },
    'dim_word-card-editor': { top: 40, left: 540, width: 300, height: 350 }
};

const dimensionSubscribers: Array<(key: string, dimension: Dimension) => any> = [];
export const subscribeToDimension = (subscriber: (key: string, dimension: Dimension) => any) => {
    dimensionSubscribers.push(subscriber);
};

const init = () => {
    dimensionKeys.forEach(key => {
        const dimensionText = window.localStorage[key];
        let dimension: Dimension;
        if (dimensionText) {
            dimension = JSON.parse(dimensionText);
            dimensionSubscribers.forEach(sub => sub(key, dimension));
            map[key] = dimension;
        }
    });
};

init();

export const updateDimension = (key: string, newDimension: Dimension) => {
    const currentDimension: Dimension | undefined = map[key];
    if (currentDimension) {
        currentDimension.top = newDimension.top || currentDimension.top;
        currentDimension.left = newDimension.left || currentDimension.left;
        currentDimension.width = newDimension.width || currentDimension.width;
        currentDimension.height = newDimension.height || currentDimension.height;
        window.localStorage.setItem(key, JSON.stringify(currentDimension));
        dimensionSubscribers.forEach(sub => sub(key, currentDimension));
    } else {
        map[key] = newDimension;
        window.localStorage.setItem(key, JSON.stringify(newDimension));
        dimensionSubscribers.forEach(sub => sub(key, newDimension));

    }
};

export const getDimension = (key: string): Dimension | undefined => {
    return map[key];
};