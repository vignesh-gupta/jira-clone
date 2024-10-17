import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.login["$post"]({ json });

      return await res.json();
    },
    onSuccess: ({ success, error }) => {
      if (!success) {
        toast.error(error ?? "Failed to login");
      } else {
        toast.success("Logged in successfully");
      }

      router.refresh();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: () => {
      toast.error("Failed to login");
    },
  });

  return mutation;
};
