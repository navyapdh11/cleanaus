'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { trpc } from '@/lib/trpc/client';
import { SEOErrorBoundary } from './error-boundary';
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react';

interface KeywordTableProps {
  domain: string;
}

interface KeywordRow {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  difficulty: number;
  url: string;
}

const columnHelper = createColumnHelper<KeywordRow>();

export function KeywordTable({ domain }: KeywordTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'position', desc: false }]);

  const { data, isLoading, error } = trpc.ahrefs.organicKeywords.useQuery(
    { domain },
    { retry: 1 }
  );

  const columns = [
    columnHelper.accessor('keyword', {
      header: 'Keyword',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('position', {
      header: 'Position',
      cell: (info) => (
        <span className={`font-semibold ${info.getValue() <= 10 ? 'text-green-600' : info.getValue() <= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
          #{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('volume', {
      header: 'Volume',
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('traffic', {
      header: 'Traffic',
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('difficulty', {
      header: 'Difficulty',
      cell: (info) => {
        const value = info.getValue();
        const color = value <= 30 ? 'text-green-600' : value <= 60 ? 'text-yellow-600' : 'text-red-600';
        return <span className={color}>{value}/100</span>;
      },
    }),
    columnHelper.accessor('url', {
      header: 'URL',
      cell: (info) => <span className="text-xs text-gray-500 truncate block max-w-[200px]">{info.getValue()}</span>,
    }),
  ];

  const table = useReactTable({
    data: (data?.success ? data.data : []) as KeywordRow[],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading keywords...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">Failed to load keywords: {error.message}</p>
      </div>
    );
  }

  return (
    <SEOErrorBoundary>
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {table.getRowModel().rows.length} of {data?.success ? data.data.length : 0} keywords
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </SEOErrorBoundary>
  );
}
