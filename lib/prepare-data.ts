import { Data } from "./DataStore";

const prepareDataForOpenAI = (
    newColumns: { [key: number]: any },
    addHeaders: (header: string) => void
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
};

export default prepareDataForOpenAI;
