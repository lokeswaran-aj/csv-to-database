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
        <div className="my-4 border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((head: string, index: number) => (
                            <TableHead key={index}>{head}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {csvData.map((rowData, index: number) => (
                        <TableRow key={index}>
                            {Object.keys(rowData).map(
                                (k: any, index: number) => (
                                    <TableCell key={index}>
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
