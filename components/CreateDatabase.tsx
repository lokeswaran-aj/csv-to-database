import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "./ui/button";
import prepareDataForOpenAI from "@/lib/prepare-data";
import useDataStore from "@/lib/DataStore";

interface CreateDatabaseProps {
    setInputCount: Dispatch<SetStateAction<number>>;
    newColumns: { [key: string]: any }[];
}

const CreateDatabase: FC<CreateDatabaseProps> = ({
    setInputCount,
    newColumns,
}) => {
    const { addHeaders, putData, updateIsMapped, csvData } = useDataStore();
    return (
        <Button
            variant="default"
            onClick={() => {
                setInputCount(0);
                updateIsMapped(true);
                prepareDataForOpenAI(newColumns, addHeaders, csvData, putData);
            }}
        >
            Create Database
        </Button>
    );
};

export default CreateDatabase;
