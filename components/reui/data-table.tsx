"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyBox } from "@/components/common/empty-box";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchKeys?: (keyof T)[];
  searchFilter?: (row: T, term: string) => boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  searchKeys,
  searchFilter,
  searchPlaceholder = "Search records...",
  pageSize = 10,
  emptyTitle = "No records found",
  emptyDescription = "There are no data rows to display.",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    if (searchFilter) {
      return data.filter((row) => searchFilter(row, term));
    }

    if (searchKeys && searchKeys.length > 0) {
      return data.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? "")
            .toLowerCase()
            .includes(term)
        )
      );
    }

    if (searchKey) {
      return data.filter((row) => {
        const val = row[searchKey];
        return String(val ?? "").toLowerCase().includes(term);
      });
    }

    return data;
  }, [data, searchKey, searchKeys, searchFilter, searchTerm]);

  const hasSearch = Boolean(
    searchKey || (searchKeys && searchKeys.length > 0) || searchFilter
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {hasSearch && (
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pr-9"
            />
            <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {filteredData.length} total entries
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={cn("px-4 py-3.5", col.className)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn("px-4 py-3 text-foreground", col.className)}
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? "")
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center">
                    <EmptyBox
                      title={emptyTitle}
                      description={emptyDescription}
                      className="border-0 bg-transparent py-4"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
