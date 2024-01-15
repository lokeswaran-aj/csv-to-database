"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "react-select";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useDataStore from "@/lib/DataStore";
import prepareDataForOpenAI from "@/lib/prepare-data";

interface ColumnMappingProps {
    columns: string[];
}
interface ColumnSelectProps {
    columns: string[];
    inputCount: number;
    setInputCount: Dispatch<SetStateAction<number>>;
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
    const { addHeaders, putData, updateIsMapped, csvData } = useDataStore();
    const options = columns.map((column) => ({ label: column, value: column }));
    const defaultColumns: { [key: number]: any } = {};
    for (let i = 0; i < inputCount; i++) {
        defaultColumns[i] = [];
    }
    const [newColumns, setNewColumns] = useState(defaultColumns);

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
                    </div>
                    <div className="ml-5 grid w-full max-w-sm items-center gap-1.5 my-4">
                        <Label>Handle Multiple source:</Label>
                        <Select
                            onValueChange={(selectedFunction) =>
                                console.log(selectedFunction)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="contatinate">
                                        Contatinate
                                    </SelectItem>
                                    <SelectItem value="cuplicate">
                                        Duplicate data
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            ))}
            <Button
                variant="default"
                onClick={() => {
                    setInputCount(0);
                    updateIsMapped(true);
                    prepareDataForOpenAI(
                        newColumns,
                        csvData,
                        addHeaders,
                        putData
                    );
                }}
            >
                Create Database
            </Button>
        </>
    );
};
export default ColumnMapping;
