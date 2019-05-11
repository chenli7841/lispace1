if (window.localStorage.getItem('image_category') == undefined) {
    window.localStorage.setItem('image_category', 'hamburg');
}

if (window.localStorage.getItem('image_index') == undefined) {
    window.localStorage.setItem('image_index', '1');
}

export const setCategoryStore = (newCategory: string) => {
    window.localStorage.setItem('image_category', newCategory);
};

export const getCategoryStore = () => {
    return window.localStorage.getItem('image_category');
};

export const setImageIndexStore = (index: number) => {
    window.localStorage.setItem('image_index', index.toString());
};

export const getImageIndexStore = (): number => {
    return parseInt(window.localStorage.getItem('image_index')!);
};