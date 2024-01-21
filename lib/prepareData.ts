import getJsonData from "./csvToJSON";
import { Data } from "./DataStore";

const prepareDataForOpenAI = async (
    newColumns: { [key: number]: any },
    addHeaders: (header: string) => void,
    csvData: string,
    putData: (newData: Data[]) => void,
    updateIsMapped: (mappingStatus: boolean) => void,
    addErrors: (message: string) => void
) => {
    var mapping: { [key: string]: string[] } = {};
    for (const index in newColumns) {
        const dest = newColumns[index]["destColName"];
        addHeaders(dest.charAt(0).toUpperCase() + dest.slice(1));
        let source = newColumns[index]["sourceColName"];
        source = source.map(
            ({ label, value }: { label: string; value: string }) => value
        );
        if (newColumns[index]["function"] === "concatenate") {
            const values = source.map((col: string) => col).join(",");
            source = `concatenate(${values})`;
        } else if (newColumns[index]["function"] === "duplicate") {
            const values = source.map((col: string) => col).join(",");
            source = `duplicate(${values})`;
        } else {
            source = `source(${source[0]})`;
        }
        mapping[dest] = source;
    }
    try {
        const data = await getJsonData(JSON.stringify(mapping), csvData);
        if (data && Array.isArray(data)) putData(data);
        else {
            updateIsMapped(false);
            throw new Error("Failed to process CSV data. Please try again.");
        }
    } catch (error: any) {
        addErrors((error as Error).message);
        updateIsMapped(false);
    }
};

export default prepareDataForOpenAI;
