import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, deleteProductImage, fetchProduct, updateProduct, uploadProductImage } from "../services/products.services";
import { toast } from "sonner";



export const useProducts = (search?: string, page?: number, limit?: number, categoryId?: number) => {
  return useQuery({
  queryKey: ["products", search, page, limit, categoryId],
  queryFn: () => fetchProduct(search, page, limit, categoryId),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      toast.success("Product created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      toast.error("Failed to create product.");
      console.log("Failed to create product.", error);
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, request}: {id: number, request: any}) => updateProduct(id, request),

    onSuccess: () => {
      toast.success("Product updated successfully.");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      toast.error("Failed to update product.");
      console.log("Failed to update product.", error);
    },
  });
};
export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, request}: {id: number, request: File}) => uploadProductImage(id, request),

    onSuccess: () => {
      console.log("Product image uploaded successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      toast.error("Failed to upload product image.");
      console.log("Failed to upload product image.", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete product.");
      console.error("Failed to delete product.", error);
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id}: {id: number}) => deleteProductImage(id),

    onSuccess: () => {
      toast.success("Product image deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      toast.error("Failed to delete product image.");
      console.log("Failed to delete product image.", error);
    },
  });
};
