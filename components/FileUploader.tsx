"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parse } from "papaparse";
import { useState } from "react";
import DatabaseTable from "./DatabaseTable";
import ColumnMapping from "./ColumnMapping";
import useDataStore from "@/lib/DataStore";

const InputFile = () => {
    const { headers, addHeaders, data, putData } = useDataStore();

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
        var tempHeaders: string[] = [];
        var mapping: { [key: string]: string[] } = {};
        Object.values(newColumns).map((newColumn) => {
            const tempColumn: string = newColumn.shift();
            tempHeaders.push(tempColumn);
            addHeaders(
                tempColumn.charAt(0).toUpperCase() + tempColumn.slice(1)
            );
            mapping[tempColumn] = [];
            newColumn.map((item: any) => {
                mapping[tempColumn].push(item.value);
            });
        });

        var tempData: any[] = [];
        var tempRowData: { [key: string]: any } = {};
        csvData.map((rowData) => {
            for (let i = 0; i < tempHeaders.length; i++) {
                const key = tempHeaders[i];
                var tempValue = "";
                tempValue += mapping[key].map((col) => rowData[col]).join(" ");
                tempRowData[key] = tempValue;
            }
            tempData.push(tempRowData);
            tempRowData = {};
        });

        putData(tempData);
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

            {isMapped && data.length > 0 && (
                <DatabaseTable headers={headers} csvData={data} />
            )}
        </>
    );
};

export default InputFile;
