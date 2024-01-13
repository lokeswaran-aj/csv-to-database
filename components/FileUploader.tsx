"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parse } from "papaparse";
import { useState } from "react";
import DatabaseTable from "./DatabaseTable";
import ColumnMapping from "./ColumnMapping";

const InputFile = () => {
    const [csvData, setCsvData] = useState<{ [key: string]: any }[]>([]);
    const [csvDataHeaders, setCsvDataHeaders] = useState<string[]>([]);
    const [isMapped, setIsMapped] = useState(false);
    const [inputCount, setInputCount] = useState(0);
    const defaultColumns: { [key: number]: any } = {};
    for (let i = 0; i < inputCount; i++) {
        defaultColumns[i] = [];
    }
    const [newColumns, setNewColumns] = useState(defaultColumns);

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
                setCsvData(results.data);
            },
        });
    };

    const createDataWithNewColumns = () => {
        var headers: string[] = [];
        var mapping: { [key: string]: string[] } = {};
        Object.values(newColumns).map((newColumn) => {
            const tempColumn = newColumn.shift();
            headers.push(tempColumn);
            mapping[tempColumn] = [];
            newColumn.map((item: any) => {
                mapping[tempColumn].push(item.value);
            });
        });
        var tempData: any[] = [];
        var tempRowData: { [key: string]: any } = {};
        setCsvDataHeaders(headers);
        csvData.map((rowData) => {
            for (let i = 0; i < headers.length; i++) {
                const key = headers[i];
                var tempValue = "";
                tempValue += mapping[key].map((col) => rowData[col]).join(" ");
                tempRowData[key] = tempValue;
            }
            tempData.push(tempRowData);
            tempRowData = {};
        });
        setCsvData(tempData);
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

            {csvDataHeaders.length > 0 && !isMapped && (
                <ColumnMapping
                    columns={csvDataHeaders}
                    setIsMapped={setIsMapped}
                    inputCount={inputCount}
                    setInputCount={setInputCount}
                    setNewColumns={setNewColumns}
                    createDataWithNewColumns={createDataWithNewColumns}
                />
            )}

            {isMapped && csvData.length > 0 && (
                <DatabaseTable headers={csvDataHeaders} csvData={csvData} />
            )}
        </>
    );
};

export default InputFile;
