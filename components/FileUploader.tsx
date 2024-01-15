"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parse } from "papaparse";
import { useState } from "react";
import DatabaseTable from "./DatabaseTable";
import ColumnMapping from "./ColumnMapping";
import useDataStore from "@/lib/DataStore";

const InputFile = () => {
    const { headers, data, putCsvData, IsMapped, updateIsMapped } =
        useDataStore();

    const [csvDataHeaders, setCsvDataHeaders] = useState<string[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateIsMapped(false);
        setCsvDataHeaders([]);
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (file) => {
                const result = file.target?.result;
                if (typeof result === "string") parseCSV(result);
            };
            reader.readAsText(e.target.files[0]);
        } else {
            console.log("No file");
        }
    };

    const parseCSV = (result: string) => {
        parse(result, {
            header: true,
            dynamicTyping: true,
            complete: (results: any) => {
                setCsvDataHeaders(results.meta.fields);
                putCsvData(results.data);
            },
        });
    };

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                <Label htmlFor="csv">Upload your csv file</Label>
                <Input
                    id="csv"
                    type="file"
                    onChange={(e) => handleFileUpload(e)}
                />
            </div>

            {csvDataHeaders.length > 0 && !IsMapped && (
                <ColumnMapping columns={csvDataHeaders} />
            )}

            {IsMapped && data.length > 0 && (
                <DatabaseTable headers={headers} csvData={data} />
            )}
        </>
    );
};

export default InputFile;
