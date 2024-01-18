import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "./ui/button";
import prepareDataForOpenAI from "@/lib/prepare-data";
import useDataStore from "@/lib/DataStore";

interface CreateDatabaseButtonProps {
    setInputCount: Dispatch<SetStateAction<number | undefined>>;
    newColumns: { [key: string]: any }[];
}

const CreateDatabaseButton: FC<CreateDatabaseButtonProps> = ({
    setInputCount,
    newColumns,
}) => {
    const { addHeaders, putData, updateIsMapped, csvData, addErrors } =
        useDataStore();
    const handleClick = () => {
        setInputCount(undefined);
        updateIsMapped(true);
        prepareDataForOpenAI(
            newColumns,
            addHeaders,
            csvData,
            putData,
            updateIsMapped,
            addErrors
        );
    };
    return (
        <>
            <Button variant="default" onClick={handleClick}>
                Create Database
            </Button>
        </>
    );
};

export default CreateDatabaseButton;
