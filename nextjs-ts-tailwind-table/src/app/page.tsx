'use client';
import * as React from "react";
import { Column, Table } from "./table";
import { Modal } from "./modal";

type Post = {
  id: number;
  title: React.ReactNode;
  body: string;
};

const PAGE_SIZE = 10;

export default function Home() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [inputText, setInputText] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Post | null>(null);
  const [sorting, setSorting] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  React.useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = React.useMemo(() => {
    let filtered = posts;
    if (inputText) {
      filtered = filtered.filter(post =>
        (typeof post.title === "string" ? post.title.toLowerCase().includes(inputText.toLowerCase()) : false) ||
        post.body.toLowerCase().includes(inputText.toLowerCase())
      );
    }
    if (sorting) {
      filtered = [...filtered].sort((a, b) => {
        if (!sorting) return 0;
        const aValue = a[sorting.key as keyof Post];
        const bValue = b[sorting.key as keyof Post];
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sorting.direction === "asc" ? -1 : 1;
        if (bValue == null) return sorting.direction === "asc" ? 1 : -1;
        if (aValue < bValue) return sorting.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [posts, inputText, page, sorting]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const pageData = filteredPosts.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  React.useEffect(() => {
    setPage(1);
  }, [inputText]);

  const columns: Column<Post>[] = [
    { key: "id", title: "ID", width: "w-16" },
    { key: "title", title: (
      <div className="flex items-center gap-2">
        <span className="font-semibold">Title</span>
        <button onClick={() => {
          setSorting((s) => {
            if (s?.key === "title") {
              return { key: "title", direction: s.direction === "asc" ? "desc" : "asc" };
            }
            return { key: "title", direction: "asc" };
          });
        }} className="text-sm text-gray-500">
          {sorting?.key === "title" ? (sorting.direction === "asc" ? "▲" : "▼") : "⇅"}
        </button>
      </div>
    ), width: "w-48", render: (row) => {
      const shortTitle = typeof row.title === "string" ? (row.title.length > 30 ? row.title.substring(0, 30) + "..." : row.title) : row.title;
      return (
        <button onClick={() => setSelected(row)} className="text-left text-blue-600 hover:underline">
          {shortTitle}
        </button>
      );
     }},
    { key: "body", title: "Body", width: "w-64", render: (row) => {
      return (
        <span>
          {row.body}
        </span>
      );
    }},
    { key: "preview", title: "Preview", width: "w-16", render: (row) => {
      return (
        <span>
          {row.body.length > 20 ? row.body.substring(0, 20) + "..." : row.body}
        </span>
      );
    }},
  ];

  return (
    <div className="min-h-screen flex bg-grey-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
        <div className="flex-1 sm:max-w-xs">
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} 
          className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Search..."/>
        </div>
      </header>
      {loading && <div className="text-center py-12">Loading...</div>}
      {error && <div className="text-red-500 py-12 text-center">Error: {error}</div>}
      {!loading && !error && (
        <>
            <Table data={pageData} columns={columns} />
            {selected !== null && (
              <div className="mt-4 p-4 border border-gray-200 rounded bg-white">
                <h2 className="text-xl font-bold mb-2">Selected Post Details</h2>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {selected.body}
                </pre>
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
        </>
      )}
      </div>
      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title}>
        {selected !== null && (
          <p className="whitespace-pre-wrap">{selected.body}</p>
        )}
      </Modal>
    </div>
  );
}
