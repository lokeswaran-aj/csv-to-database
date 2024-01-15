import getJsonData from "./CSV-to-JSON";
import { Data } from "./DataStore";

const prepareDataForOpenAI = async (
    newColumns: { [key: number]: any },
    addHeaders: (header: string) => void,
    csvData: string,
    putData: (newData: Data[]) => void,
    updateIsMapped: (mappingStatus: boolean) => void
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
            source = source[0];
        }
        mapping[dest] = source;
    }
    const data = await getJsonData(
        JSON.stringify(mapping),
        csvData,
        updateIsMapped
    );
    if (data) putData(data);
};

export default prepareDataForOpenAI;
