"use client";
import {
    Dispatch,
    FC,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
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
import CreateDatabaseButton from "./CreateDatabaseButton";

interface ColumnMappingProps {
    columns: string[];
}
interface ColumnFormProps {
    columns: string[];
    inputCount: number;
    setInputCount: Dispatch<SetStateAction<number | undefined>>;
}

const ColumnMapping: FC<ColumnMappingProps> = ({ columns }) => {
    const [inputCount, setInputCount] = useState<number | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const handleInputChange = (e: { target: { value: string } }) => {
        const inputValue = parseInt(e.target.value, 10);

        if (!isNaN(inputValue) && inputValue >= 1) {
            setInputCount(inputValue);
            setErrorMessage("");
        } else {
            setInputCount(undefined);
            setErrorMessage("The number must be greater than 1.");
        }
    };

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                <Label htmlFor="columnCount">Enter the number of columns</Label>
                <Input
                    type="number"
                    id="columnCount"
                    placeholder="5"
                    min={1}
                    max={columns.length}
                    value={inputCount === undefined ? "" : inputCount}
                    onChange={handleInputChange}
                />
                {errorMessage && (
                    <span className="text-red-500">{errorMessage}</span>
                )}
            </div>
            {inputCount !== undefined && (
                <ColumnForm
                    inputCount={inputCount}
                    columns={columns}
                    setInputCount={setInputCount}
                />
            )}
        </>
    );
};

const ColumnForm: FC<ColumnFormProps> = ({
    columns,
    inputCount,
    setInputCount,
}) => {
    const options = useMemo(
        () => columns.map((column) => ({ label: column, value: column })),
        [columns]
    );
    const [newColumns, setNewColumns] = useState<{ [key: string]: any }[]>([]);

    const createDefaultColumns = useCallback(() => {
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

    const handleDestColNameChange = (index: number, value: string) => {
        setNewColumns((prevState) => {
            const newState = [...prevState];
            newState[index].destColName = value;
            return newState;
        });
    };

    const handleSourceColNameChange = (
        index: number,
        selectedOptions: string[]
    ) => {
        setNewColumns((prevState) => {
            const newState = [...prevState];
            newState[index].sourceColName = selectedOptions;
            return newState;
        });
        if (selectedOptions.length < 2)
            setNewColumns((prevState) => {
                const newState = [...prevState];
                newState[index].function = "";
                return newState;
            });
    };

    const handleFunctionChange = (index: number, selectedFunction: string) => {
        setNewColumns((prevState) => {
            const newState = [...prevState];
            newState[index].function = selectedFunction;
            return newState;
        });
    };

    useEffect(() => {
        createDefaultColumns();
    }, [createDefaultColumns]);

    return (
        <>
            {[...Array(inputCount)].map((_, index) => (
                <div className="flex" key={index}>
                    <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                        <Label htmlFor={`column${index}`}>
                            Enter the name of column {index + 1}
                        </Label>
                        <Input
                            type="text"
                            id={`column${index}`}
                            placeholder="First Name"
                            onChange={(e) =>
                                handleDestColNameChange(index, e.target.value)
                            }
                            value={newColumns[index]?.destColName || ""}
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
                                    handleSourceColNameChange(index, [
                                        ...selectedOptions,
                                    ])
                                }
                                value={newColumns[index]?.sourceColName || []}
                            />
                        </div>
                    </div>

                    {newColumns[index]?.sourceColName?.length > 1 && (
                        <div className="ml-5 grid w-full max-w-sm items-center gap-1.5 my-4">
                            <Label>Handle Multiple source:</Label>
                            <Select
                                onValueChange={(selectedFunction) =>
                                    handleFunctionChange(
                                        index,
                                        selectedFunction
                                    )
                                }
                                defaultValue={undefined}
                                value={newColumns[index]?.function || ""}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="concatenate">
                                            Concatenate
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
            <CreateDatabaseButton
                setInputCount={setInputCount}
                newColumns={newColumns}
            />
        </>
    );
};

export default ColumnMapping;
