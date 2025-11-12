let global: unknown = undefined;

export const savelocalStorage = (key: string, data: unknown): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getlocalStorage = <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
};

export const removelocaStorage = (key: string): void => {
    localStorage.removeItem(key);
};

export const setGlobal = (global_: unknown): void => {
    global = global_;
}

export const getGlobal = <T>(): T => {
    return global as T;
}
