import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

type UseGetMembersProps = {
  workspaceId: string;
};

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: [QueryKeys.MEMBERS, workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
