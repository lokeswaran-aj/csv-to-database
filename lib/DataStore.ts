import { create } from "zustand";

interface Data {
    [key: string]: string | number | boolean;
}

interface IDataStore {
    headers: string[];
    addHeaders: (header: string) => void;
    data: Data[];
    putData: (newData: Data[]) => void;
}

const useDataStore = create<IDataStore>((set) => ({
    headers: [],
    data: [],
    addHeaders: (header: string) =>
        set((state) => ({
            headers: [...state.headers, header],
        })),
    putData: (newData: Data[]) =>
        set((state) => ({
            data: [...newData],
        })),
}));

export default useDataStore;
