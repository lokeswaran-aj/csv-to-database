"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { parse } from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatabaseTable from "./DatabaseTable";
import ColumnMapping from "./ColumnMapping";
import useDataStore from "@/lib/DataStore";
import toast, { Toaster } from "react-hot-toast";

const InputFile = () => {
    const { putCsvData, IsMapped, updateIsMapped, errors, addErrors } =
        useDataStore();
    const [csvDataHeaders, setCsvDataHeaders] = useState<string[]>([]);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            updateIsMapped(false);
            setCsvDataHeaders([]);
            const file = e.target.files?.[0];

            if (!file) {
                throw new Error("No file selected");
            }
            if (!(file.type === "text/csv")) {
                throw new Error("Invalid file type. Upload only csv file");
            }

            const fileContent = await readFileAsync(file);
            parseCSV(fileContent);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const readFileAsync = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    const parseCSV = (result: string) => {
        putCsvData(result);

        parse(result, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                setCsvDataHeaders(results.meta.fields || []);
            },
        });
    };

    useEffect(() => {
        if (errors) {
            toast.error(errors);
            addErrors(null);
        }
    }, [errors, addErrors]);

    return (
        <>
            <Toaster />
            <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                <Label htmlFor="csv">Upload your CSV file</Label>
                <Input id="csv" type="file" onChange={handleFileUpload} />
            </div>

            {csvDataHeaders.length > 0 && !IsMapped && (
                <ColumnMapping columns={csvDataHeaders} />
            )}

            {IsMapped && <DatabaseTable />}
        </>
    );
};

export default InputFile;
