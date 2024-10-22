import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.members[":memberId"].$delete({
        param,
      });

      if (!res.ok) throw new Error("Failed to delete member");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MEMBERS] });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Failed to delete member");
    },
  });

  return mutation;
};
