"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parse } from "papaparse";
import { useState } from "react";
import DatabaseTable from "./DatabaseTable";
import ColumnMapping from "./ColumnMapping";

const InputFile = () => {
    const [csvData, setCsvData] = useState<string[]>([]);
    const [csvDataHeaders, setCsvDataHeaders] = useState<string[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const parseCSV = (csvData: string) => {
        parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: (results: any) => {
                setCsvDataHeaders(results.meta.fields);
                // setCsvData(results.data);
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

            {csvDataHeaders.length > 0 && (
                <ColumnMapping columns={csvDataHeaders} />
            )}

            {csvData.length > 0 && (
                <DatabaseTable headers={csvDataHeaders} csvData={csvData} />
            )}
        </>
    );
};

export default InputFile;
