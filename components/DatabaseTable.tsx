import { FC } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DatabaseTableProps {
    headers: string[];
    csvData: any[];
}

const DatabaseTable: FC<DatabaseTableProps> = ({ headers, csvData }) => {
    return (
        <div className="my-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((head: string, index: number) => (
                            <TableHead
                                className="border bg-slate-500 text-slate-50"
                                key={index}
                            >
                                {head}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {csvData.map((rowData, index: number) => (
                        <TableRow key={index}>
                            {Object.keys(rowData).map(
                                (k: any, index: number) => (
                                    <TableCell className="border" key={index}>
                                        {rowData[k]}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default DatabaseTable;
