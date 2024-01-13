"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/ui/button";

interface ColumnMappingProps {
    columns: string[];
    createDataWithNewColumns: () => void;
    inputCount: number;
    setInputCount: Dispatch<SetStateAction<number>>;
    setIsMapped: Dispatch<SetStateAction<boolean>>;
    setNewColumns: Dispatch<
        SetStateAction<{
            [key: number]: any;
        }>
    >;
}
interface ColumnSelectProps {
    columns: string[];
    createDataWithNewColumns: () => void;
    inputCount: number;
    setInputCount: Dispatch<SetStateAction<number>>;
    setIsMapped: Dispatch<SetStateAction<boolean>>;
    setNewColumns: Dispatch<
        SetStateAction<{
            [key: number]: any;
        }>
    >;
}

const ColumnMapping: FC<ColumnMappingProps> = ({
    columns,
    setIsMapped,
    inputCount,
    setInputCount,
    setNewColumns,
    createDataWithNewColumns,
}) => {
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
            <ColumnSelect
                inputCount={inputCount}
                columns={columns}
                setInputCount={setInputCount}
                setIsMapped={setIsMapped}
                setNewColumns={setNewColumns}
                createDataWithNewColumns={createDataWithNewColumns}
            />
        </>
    );
};

const ColumnSelect: FC<ColumnSelectProps> = ({
    columns,
    inputCount,
    setInputCount,
    setIsMapped,
    setNewColumns,
    createDataWithNewColumns,
}) => {
    const options = columns.map((column) => ({ label: column, value: column }));

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
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewColumns((prevState) => ({
                                    ...prevState,
                                    [index]: [value],
                                }));
                            }}
                        />
                    </div>
                    <Select
                        form=""
                        isMulti
                        name="colors"
                        options={options}
                        onChange={(selectedOptions) =>
                            setNewColumns((prevState) => ({
                                ...prevState,
                                [index]: [
                                    prevState[index][0],
                                    ...selectedOptions,
                                ],
                            }))
                        }
                    />
                </div>
            ))}
            <Button
                variant="default"
                onClick={() => {
                    setInputCount(0);
                    setIsMapped(true);
                    createDataWithNewColumns();
                }}
            >
                Create Database
            </Button>
        </>
    );
};
export default ColumnMapping;
