import { create } from "zustand";

export interface Data {
    [key: string]: string | number | boolean;
}

interface IDataStore {
    headers: string[];
    addHeaders: (header: string) => void;
    data: Data[];
    putData: (newData: Data[]) => void;
    csvData: string;
    putCsvData: (newData: string) => void;
    IsMapped: boolean;
    updateIsMapped: (mappingStatus: boolean) => void;
    errors: string | null;
    addErrors: (message: string | null) => void;
}

const useDataStore = create<IDataStore>((set) => ({
    headers: [],
    data: [],
    csvData: "",
    IsMapped: false,
    errors: null,
    addHeaders: (header: string) =>
        set((state) => ({
            headers: [...state.headers, header],
        })),
    putData: (newData: Data[]) =>
        set(() => ({
            data: [...newData],
        })),
    putCsvData: (newData: string) =>
        set(() => ({
            csvData: newData,
        })),
    updateIsMapped: (mappingStatus: boolean) =>
        set(() => ({ IsMapped: mappingStatus })),
    addErrors: (message: string | null) =>
        set(() => ({
            errors: message,
        })),
}));

export default useDataStore;
