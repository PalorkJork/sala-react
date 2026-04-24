

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkTransaction, createPayment } from "../services/payment.services";


export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create payment");
      console.log("Failed to create payment", error);
    },
  });
};


export const useCheckTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkTransaction,
    onSuccess: () => {
      toast.success("Transaction checked successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to check transaction");
      console.log("Failed to check transaction", error);
    },
  });
};