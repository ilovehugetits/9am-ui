import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon as Search } from "@/components/ui/search"
import { ChevronLeftIcon } from "@/components/ui/chevron-left"
import { ChevronRightIcon } from "@/components/ui/chevron-right"
import { useT } from "@/i18n"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  toolbar?: React.ReactNode
  /**
   * Footer row-count label. Defaults to the generic `ui.common.rowCount`
   * ("{count} row(s)"); pass a domain-specific one where it reads better —
   * e.g. `(n) => t("ui.common.couponCount", { count: n })`.
   */
  countLabel?: (count: number) => string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  toolbar,
  countLabel,
}: DataTableProps<TData, TValue>) {
  const t = useT()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="flex flex-col gap-2.5 h-full ">
      <div className="flex items-center justify-between gap-2.5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <Input
            placeholder={searchPlaceholder ?? t("ui.common.searchPlaceholder")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9! pr-3! py-2! w-[250px] appearance-none! bg-input border font-medium placeholder:font-normal text-sm rounded-md"
          />
        </div>
        {toolbar}
      </div>
      <div className="bg-input flex-1 overflow-auto scrollbar-mini scrollbar-mini-absolute rounded-lg border border-black/10 dark:border-white/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-black/10 dark:border-white/10 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-foreground/60 text-xs font-medium uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-black/10 dark:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-foreground text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-foreground/50">
                  {t("ui.common.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-8 justify-between">
        <div className="text-foreground/50 text-xs">
          {countLabel
            ? countLabel(table.getFilteredRowModel().rows.length)
            : t("ui.common.rowCount", { count: table.getFilteredRowModel().rows.length })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default2"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon size={12} />
          </Button>
          <span className="text-foreground/70 text-xs">
            {t("ui.common.pageOf", { page: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
          </span>
          <Button
            variant="default2"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon size={12} />
          </Button>
        </div>
      </div>
    </div>
  )
}
