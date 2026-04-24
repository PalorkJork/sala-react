import React, { useState } from "react";
import { DataTable } from "../components/data-table";
import { columns } from "../components/categories/columns";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import CategoryForm from "../components/categories/CategoryForm";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Plus, Search } from "lucide-react";
import { Spinner } from "../components/ui/spinner";
import type { ICategory } from "../types/category";
import { toast } from "sonner";
import ConfirmDelete from "../components/categories/ConfirmDelete";
import { useDebounce } from "use-debounce";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Category = () => {
  // === State ===
  const [searchInput, setSearchInput] = useState("");
  const [searchDebounced] = useDebounce(searchInput, 500);

  const [openCategory, setOpenCategory] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [category, setCategory] = useState<ICategory | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // === Hooks ===
  const { data, isLoading } = useCategories(searchDebounced, page, limit);
  const pagination = data?.pagination;

  const { mutate: deleteCategoryMutate } = useDeleteCategory();

  // === Handlers ===
  const handleEdit = (category: ICategory) => {
    setCategory(category);
    setOpenCategory(true);
  };

  const handleDelete = (category: ICategory) => {
    setCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!category?.id) return;
    deleteCategoryMutate(
      { id: category.id },
      {
        onSuccess: () => toast.success("Category deleted successfully"),
      }
    );
  };

  const handleRowsChange = (value: string) => {
    setLimit(Number(value));
    setPage(1); // reset page
  };

  // === Loading State ===
  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2">
        <Spinner /> Loading....
      </div>
    );
  }

  return (
    <div>
      {/* Search & Create */}
      <div className="flex gap-5 mb-5">
        <Input
          placeholder="Search by name"
          className="w-[50%]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Button className="w-[100px]" onClick={() => setPage(1)}>
          Search <Search />
        </Button>

        <Button onClick={() => setOpenCategory(true)}>
          Create Category <Plus />
        </Button>
      </div>

      {/* Modals */}
      <CategoryForm
        open={openCategory}
        setOpen={setOpenCategory}
        category={category}
      />
      <ConfirmDelete
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        category={category}
        confirmDelete={confirmDelete}
      />

      {/* Data Table */}
      <DataTable
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
        data={data?.data ?? []}
      />

      <div className="flex items-center justify-between border-t pt-4 mt-4">
        {/* LEFT: Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>

          <Select
            defaultValue="10"
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* RIGHT: Pagination */}
        <Pagination>
          <PaginationContent className="flex items-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(pagination?.prevPage)}
                className="cursor-pointer"
              />
            </PaginationItem>

            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={pagination?.page === page}
                  onClick={() => setPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(pagination?.nextPage)}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Category;
