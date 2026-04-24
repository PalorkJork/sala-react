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
import type { IProduct } from "../../types/product";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
interface Props{
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export const columns = ({onEdit, onDelete}: Props): ColumnDef<IProduct>[] => [
  {
    header: "NO",
    cell: ({row}) => <div>{row.index + 1}</div>
  },
  {
    header: "Image",
    cell: ({row}) => <div><img className="aspect-square w-[100px] h-[100px]"
     src={row.original.productImages?.[0]?.imageUrl ?? "/no-img.png"}/></div>
  },
  
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>
        <Badge className="text-green-500">${row.original.price}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "qty",
    header: "Quantity",
    cell: ({ row }) => (
      <div>
        <Badge>{row.original.qty}</Badge>
      </div>
    ),
  },
  {
    header: "Category",
    cell: ({ row }) => (
      <div>
        <Badge className="bg-blue-500">{row.original.category?.name}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "isActive",
    cell: ({ row }) => (
      <div>
        <Badge>true{row.original.isActive}</Badge>
      </div>
    ),
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
            <DropdownMenuItem onClick={()=> onEdit(row.original)} className="text-blue-500">
              <Pencil className="text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=> onDelete(row.original)} className="text-red-500">
              <Trash2 className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
