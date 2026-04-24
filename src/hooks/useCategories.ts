// useCategories.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryList,
  updateCategory,
} from "../services/category.services";

export const useCategories = (
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["categories", search, page, limit],
    queryFn: () => getCategories(search, page, limit),
    keepPreviousData: true, // keeps previous table data while fetching new page
  });
};

export const useCategoryList = () => {
  return useQuery({
    queryKey: ["categories-list"],
    queryFn: () => getCategoryList(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Failed to create category.", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      updateCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Failed to update category.", error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id?: number }) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete category.", error);
    },
  });
};