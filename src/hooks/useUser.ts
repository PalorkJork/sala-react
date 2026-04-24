import {  useQuery,  } from "@tanstack/react-query";
import { getUser } from "../services/user.services";

export const useUser = (search?: string) => {
  return useQuery({
    queryKey: ["user", search],
    queryFn: () => getUser(search),
  });
};

// export const useCreateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createCategory,

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["categories"],
//       });
//     },

//     onError: (error: any) => {
//       console.log("Failed to create category.", error);
//     },
//   });
// };

// export const useUpdateCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({id, request}: {id: number, request: any}) =>
//       updateCategory(id, request),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["categories"],
//       });
//     },

//     onError: (error: any) => {
//       console.log("Failed to create category.", error);
//     },
//   });
// };

// export const useDeleteCategory = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({id }: {id?: number}) =>
//       deleteCategory(id ),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["categories"],
//       });
//     },

//     onError: (error: any) => {
//       console.log("Failed to create category.", error);
//     },
//   });
// };