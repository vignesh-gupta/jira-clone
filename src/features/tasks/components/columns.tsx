"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Task } from "../types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns : ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },


  }
]