"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function InputFile() {
    const [csvData, setCsvData] = useState<string>("");
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (file) => {
                const result = file.target?.result;
                if (typeof result === "string") setCsvData(result);
            };
            reader.readAsText(e.target.files[0]);
        } else {
            console.log("No file");
        }
    };

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv">Upload your csv file</Label>
                <Input
                    id="csv"
                    type="file"
                    onChange={(e) => handleFileUpload(e)}
                />
            </div>
            {csvData}
        </>
    );
}
