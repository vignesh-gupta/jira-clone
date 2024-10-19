import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: [QueryKeys.TASKS, workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
