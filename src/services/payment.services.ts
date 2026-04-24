import api from "./lib/axios";



export const createPayment = async (orderId: number) => {
  return await api.post(`/api/v1/payments/${orderId}`)
};
export const checkTransaction = async (tranId?: string) => {
  return await api.post(`/api/v1/payments/${tranId}/check`)
};