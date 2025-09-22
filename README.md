# Nextjs-ts-tailwind-table

## Overview

This project demonstrates a reusable table component in Next.js with TypeScript and Tailwind CSS. It supports:

* Client-side and server-side pagination
* Search filter for titles
* Modal preview for full post details
* Optional sorting (for title)
* Reusable columns with custom rendering
* Jest + React Testing Library setup for unit tests

## Features

1. **Next.js (latest) + TypeScript**
2. **Tailwind CSS** for styling
3. Fetching posts from JSONPlaceholder API
4. Responsive layout
5. Loading and error states
6. Reusable Table component with custom columns
7. Server-side pagination example
8. Jest testing setup for the Table component

---

## Requirements

* Node.js 18+
* npm or yarn

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shefali016/Nextjs-ts-tailwind-table.git
cd nextjs-ts-tailwind-table
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## Testing

We use **Jest** + **React Testing Library** for unit tests.

### Run tests

```bash
npm run test
```

### Configuration files

* `jest.config.js` in project root
* `jest.setup.ts` in project root

---

## Build for production

```bash
npm run build
npm start
```

---

## Data Fetching Strategy

We used **CSR (Client Side Rendering)** because:

* The data changes frequently.
* We want loading states and client-side interactivity like pagination and search.
* SSR/SSG could be used for SEO-heavy pages, but this demo focuses on client-side UX.

---

## Reusable Table Component

The table accepts `columns`, `data`, `pageSize`, `currentPage`, `onPageChange`, and `totalCount` props.

Each column can define a `render(row)` function for custom rendering.

---

## What Would Be Different in Production

* Use React Query or SWR for caching and background refetching
* Implement proper error boundaries
* Add accessibility features (keyboard navigation, ARIA attributes)
* Use environment variables for API URLs
* Optimize for SEO with SSR/SSG when needed

---

## Server-side Pagination Example

A full example is included in `pages/index.tsx` showing how to fetch data per page from the API using `?_page` and `?_limit` params.

---

## License

MIT
