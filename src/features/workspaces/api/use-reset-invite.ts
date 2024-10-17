import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { QueryKeys } from "@/lib/constants";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite"]["$post"]
>;

export const useResetInvite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"][
        "reset-invite"
      ].$post({
        param,
      });

      if (!res.ok) throw new Error("Failed to reset invite");

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.WORKSPACES] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WORKSPACE, data.$id],
      });
    },
    onError: (err) => {
      console.log(err);

      toast.error(err.message ?? "Failed to create workspace");
    },
  });

  return mutation;
};