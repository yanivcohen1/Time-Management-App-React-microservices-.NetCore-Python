// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from "react";

type SharedState<D = any> = {
    user: string | null;
    setUser: (user: string | null) => void;
    data: D;
    setData: (data: D) => void;
};

const AppContext = createContext<SharedState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    return (
        <AppContext.Provider value={{ user, setUser ,data, setData}}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use context
export const useAppContext = <D = any>(): SharedState<D> => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
