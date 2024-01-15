import { Data } from "./DataStore";

const prepareDataForOpenAI = (
    newColumns: { [key: number]: any },
    csvData: { [key: string]: any }[],
    addHeaders: (header: string) => void,
    putData: (newData: Data[]) => void
) => {
    console.log(newColumns, csvData);
    var tempHeaders: string[] = [];
    var mapping: { [key: string]: string[] } = {};
    Object.values(newColumns).map((newColumn) => {
        const tempColumn: string = newColumn.shift();
        tempHeaders.push(tempColumn);
        addHeaders(tempColumn.charAt(0).toUpperCase() + tempColumn.slice(1));
        mapping[tempColumn] = [];
        newColumn.map((item: any) => {
            mapping[tempColumn].push(item.value);
        });
    });

    var tempData: any[] = [];
    var tempRowData: { [key: string]: any } = {};
    csvData.map((rowData) => {
        for (let i = 0; i < tempHeaders.length; i++) {
            const key = tempHeaders[i];
            var tempValue = "";
            tempValue += mapping[key].map((col) => rowData[col]).join(" ");
            tempRowData[key] = tempValue;
        }
        tempData.push(tempRowData);
        tempRowData = {};
    });

    putData(tempData);
};

export default prepareDataForOpenAI;
