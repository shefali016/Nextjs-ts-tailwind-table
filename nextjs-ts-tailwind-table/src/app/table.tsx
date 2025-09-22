import * as React from "react";

export type Column<T> = {
    key: string;
    title: string | React.ReactNode;
    width?: string;
    render?: (row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, any>> = {
    data: T[];
    columns: Column<T>[];
};

export const Table = <T extends Record<string, any>>({ data, columns }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={`py-2 px-4 border-b ${col.width ? `w-${col.width}` : ''}`}>
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-100">
                            {columns.map((col) => (
                                <td key={col.key} className="py-2 px-4 border-b">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}