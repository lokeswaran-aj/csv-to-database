"use client";
import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";

interface ColumnMappingProps {
    columns: string[];
}
interface ColumnSelectProps {
    columns: string[];
    inputCount: number;
}

const ColumnMapping: FC<ColumnMappingProps> = ({ columns }) => {
    const [inputCount, setInputCount] = useState(0);
    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                <Label htmlFor="columnCount">Ener the number of columns</Label>
                <Input
                    type="number"
                    id="columnCount"
                    placeholder="10"
                    min={0}
                    max={columns.length}
                    onChange={(e) => {
                        e.target.value.length > 0 &&
                            setInputCount(e.target.valueAsNumber);
                    }}
                />
            </div>
            <ColumnSelect inputCount={inputCount} columns={columns} />
        </>
    );
};

const ColumnSelect: FC<ColumnSelectProps> = ({ columns, inputCount }) => {
    const options = columns.map((column) => ({ label: column, value: column }));
    const [selected, setSelected] = useState([]);
    console.log(selected);

    return (
        <>
            {[...Array(inputCount)].map((_, index) => (
                <div className="flex" key={index}>
                    <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                        <Label htmlFor={`columnn${index}`}>
                            Enter the name of column {index + 1}
                        </Label>
                        <Input
                            type="text"
                            id={`columnn${index}`}
                            placeholder="First Name"
                        />
                    </div>
                    <Select
                        isMulti
                        name="colors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
            ))}
        </>
    );
};
export default ColumnMapping;
