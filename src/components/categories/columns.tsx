"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ICategory } from "../../types/category";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface Props {
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: Props): ColumnDef<ICategory>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-green-500">
              <Eye className="text-green-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
              className="text-blue-500"
            >
              <Pencil className="text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
