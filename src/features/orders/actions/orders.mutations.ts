import { useMutation } from "@tanstack/react-query";
import { checkoutOrder } from "./orders.actions";

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: checkoutOrder,
  });
}
