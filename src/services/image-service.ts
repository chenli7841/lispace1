interface Map {
    [key: string]: number
}

const imageMap: Map = {
    'hamburg': 12,
    'bremen': 8,
    'frankfurt': 24
};

export const getImageCount = (category: string): number | undefined =>{
    return imageMap[category];
};