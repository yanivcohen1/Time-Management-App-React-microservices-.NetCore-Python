let global: any = undefined;

export const saveData = (key: string, data: any): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getData = <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
};

export const setGlobal = (global_: any): void => {
    global = global_;
}

export const getGlobal = <T>(): T => {
    return global as T;
}