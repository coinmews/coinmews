import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData> {
    columns: {
        accessorKey: string;
        header: React.ReactNode;
        cell: ({ row }: { row: { original: TData } }) => React.ReactNode;
        enableSorting?: boolean;
    }[];
    data: TData[];
    pageCount: number;
    currentPage: number;
    onRowClick?: (rowData: TData) => void;
}

export function DataTable<TData>({
    columns,
    data,
    pageCount,
    currentPage,
    onRowClick,
}: DataTableProps<TData>) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border">
                        {columns.map((column) => (
                            <TableHead
                                key={column.accessorKey}
                                className={`text-left border-r border-border last:border-r-0 ${column.enableSorting ? 'cursor-pointer select-none' : ''}`}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow 
                            key={i}
                            onClick={() => onRowClick?.(row)}
                            className={`border-b border-border last:border-b-0 ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                        >
                            {columns.map((column) => (
                                <TableCell 
                                    key={column.accessorKey}
                                    className="text-left border-r border-border last:border-r-0"
                                >
                                    {column.cell({ row: { original: row } })}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 