import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Table, Column } from "./table";

type TestData = {
    id: number;
    name: string;
    age: number;
    };

const columns: Column<TestData>[] = [
    { key: "id", title: "ID", width: "1/12" },
    { key: "name", title: "Name", width: "5/12" },
    { key: "age", title: "Age", width: "2/12", render: (row) => <span>{row.age} years</span> },
];

const data: TestData[] = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
];

describe("Table Component", () => {
    it("renders table with correct headers", () => {
        render(<Table data={data} columns={columns} />);
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Age")).toBeInTheDocument();
    });

    it("renders table rows with correct data", () => {
        render(<Table data={data} columns={columns} />);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("30 years")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("25 years")).toBeInTheDocument();
    });

    it("applies column widths correctly", () => {
        const { container } = render(<Table data={data} columns={columns} />);
        const thElements = container.querySelectorAll("th");
        expect(thElements[0]).toHaveClass("w-1/12");
        expect(thElements[1]).toHaveClass("w-5/12");
        expect(thElements[2]).toHaveClass("w-2/12");
    });
}); 