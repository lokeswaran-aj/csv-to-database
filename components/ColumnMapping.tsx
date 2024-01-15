"use client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "react-select";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CreateDatabase from "./CreateDatabase";

interface ColumnMappingProps {
    columns: string[];
}
interface ColumnSelectProps {
    columns: string[];
    inputCount: number;
    setInputCount: Dispatch<SetStateAction<number>>;
}

const ColumnMapping: FC<ColumnMappingProps> = ({ columns }) => {
    const [inputCount, setInputCount] = useState<number>(0);

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
            />
        </>
    );
};

const ColumnSelect: FC<ColumnSelectProps> = ({
    columns,
    inputCount,
    setInputCount,
}) => {
    const options = columns.map((column) => ({ label: column, value: column }));
    const [newColumns, setNewColumns] = useState<{ [key: string]: any }[]>([]);
    useEffect(() => {
        const tempDefaultColumns: { [key: string]: any }[] = [];
        for (let i = 0; i < inputCount; i++) {
            tempDefaultColumns.push({
                destColName: "",
                sourceColName: [],
                function: "",
            });
        }
        setNewColumns(tempDefaultColumns);
    }, [inputCount]);

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
                                setNewColumns((prevState) => {
                                    let newState = { ...prevState };
                                    newState[index]["destColName"] = value;
                                    return newState;
                                });
                            }}
                        />
                    </div>
                    <div className="ml-5 grid w-full max-w-sm items-center gap-1.5 my-4">
                        <Label htmlFor={`source${index}`}>
                            Choose source column:
                        </Label>
                        <div>
                            <MultiSelect
                                id={`source${index}`}
                                isMulti
                                name="colors"
                                options={options}
                                onChange={(selectedOptions) =>
                                    setNewColumns((prevState) => {
                                        let newState = { ...prevState };
                                        newState[index]["sourceColName"] =
                                            selectedOptions;
                                        return newState;
                                    })
                                }
                            />
                        </div>
                    </div>
                    {newColumns[index] &&
                        newColumns[index]["sourceColName"]?.length > 1 && (
                            <div className="ml-5 grid w-full max-w-sm items-center gap-1.5 my-4">
                                <Label>Handle Multiple source:</Label>
                                <Select
                                    onValueChange={(selectedFunction) =>
                                        setNewColumns((prevState) => {
                                            let newState = { ...prevState };
                                            newState[index]["function"] =
                                                selectedFunction;
                                            return newState;
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="concatenate">
                                                Contatinate
                                            </SelectItem>
                                            <SelectItem value="duplicate">
                                                Duplicate data
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                </div>
            ))}
            <CreateDatabase
                setInputCount={setInputCount}
                newColumns={newColumns}
            />
        </>
    );
};
export default ColumnMapping;
