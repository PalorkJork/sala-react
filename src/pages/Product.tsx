import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

import { DataTable } from "../components/data-table";
import { columns } from "../components/products/columns";

import { Spinner } from "../components/ui/spinner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import ProductForm from "../components/products/ProductForm";

import { Plus, Search } from "lucide-react";
import type { IProduct } from "../types/product";
import { useProducts, useDeleteProduct } from "../hooks/useProduct";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenStorage";
import FileUpload01 from "../components/file-upload-01";

const Product = () => {

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [openProduct, setOpenProduct] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const navigate = useNavigate();

  // set selectedProduct for select for edit or delete
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined
  );

  const { data: productData, isLoading } = useProducts(search, page, limit);
  const { mutate: deleteProductMutate, isPending: isDeleting } = useDeleteProduct();

  const pagination = productData?.pagination;
  console.log("pagination", pagination);

  const handleSearch = () => {
    console.log("Search input", searchInput);
    setSearch(searchInput);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2">
        <Spinner /> Loading....
      </div>
    );
  }

  // === edit product ===
  const onEdit = (product: IProduct) => {
    console.log("edit product: ", product);
    setSelectedProduct(product);
    setOpenProduct(true);
  };

  // === delete product ===
  const onDelete = (product: IProduct) => {
    console.log("delete product", product);
    setSelectedProduct(product);
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutate({ id: selectedProduct.id }, {
        onSuccess: () => {
          setOpenDelete(false);
          setSelectedProduct(undefined);
        }
      });
    }
  };

  const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }

  return (
    <div>
      {/* <FileUpload01 /> */}

      <ProductForm
        open={openProduct}
        setOpen={()=>{
          setOpenProduct(false)
          setSelectedProduct(undefined);
        }}
        product={selectedProduct}
      />

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{selectedProduct?.name}"
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex gap-5 mb-5">
        <Input
          className="w-[50%]"
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Button className="w-[100px]" onClick={handleSearch}>
          Search <Search />
        </Button>

        <div className="flex gap-3">
          <Button onClick={() => setOpenProduct(true)}>
            Create Product <Plus />
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns({ onEdit, onDelete })}
        data={productData?.data ?? []}
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

export default Product;
