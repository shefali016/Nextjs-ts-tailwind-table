# Extending Table for Server-side Pagination

Here’s how you can modify the `Table` component and the main page to support **server-side pagination** without tightly coupling the table to any specific data source. The idea is to:

1. Keep the `Table` component **dumb** — it only displays the data passed to it.
2. Let the parent component handle fetching and providing `data` + `totalCount` + `page`.
3. Pass pagination callbacks like `onPageChange` from parent to child.

---

### Table.tsx (unchanged for rendering)

```tsx
import React from 'react'

export type Column<T> = {
  key: string
  title: string | React.ReactNode
  width?: string
  render?: (row: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange
}: TableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 text-left text-sm font-medium text-gray-700 ${col.width ?? ''}`}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={row.id ?? idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-800 align-top">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} className="px-3 py-1 bg-gray-100 rounded">Prev</button>
          <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className="px-3 py-1 bg-gray-100 rounded">Next</button>
        </div>
      </div>
    </div>
  )
}
```

---

### Example: pages/index.tsx with server-side pagination

```tsx
import React, { useEffect, useState } from 'react'
import Table, { Column } from '../components/Table'

type Post = {
  id: number
  title: string
  body: string
}

const PAGE_SIZE = 10

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${PAGE_SIZE}`)
      .then((res) => {
        const total = Number(res.headers.get('x-total-count')) || 100 // fallback for demo
        setTotalCount(total)
        return res.json()
      })
      .then((data) => setPosts(data))
      .finally(() => setLoading(false))
  }, [page])

  const columns: Column<Post>[] = [
    { key: 'id', title: 'ID', width: 'w-16' },
    { key: 'title', title: 'Title' },
    { key: 'body', title: 'Body' },
  ]

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Posts (Server-side Pagination)</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          data={posts}
          totalCount={totalCount}
          currentPage={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
```

---

### How it works

1. We call the API with `_page` and `_limit` query params.
2. The API returns only one page of data + total count in headers.
3. We pass `page`, `totalCount`, and `onPageChange` to the Table.
4. The Table renders pagination controls and calls `onPageChange` when buttons are clicked.

This approach scales easily to real server APIs where you may have millions of records.
