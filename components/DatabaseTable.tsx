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
                        <TableHead className="border-2 bg-slate-500 text-slate-50">
                            ID
                        </TableHead>
                        {headers.map((head: string, index: number) => (
                            <TableHead
                                className="border-2 bg-slate-500 text-slate-50"
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
                            <TableCell className="border-2" key={index}>
                                {index + 1}
                            </TableCell>
                            {Object.keys(rowData).map(
                                (k: any, index: number) => (
                                    <TableCell className="border-2" key={index}>
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
