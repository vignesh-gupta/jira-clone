import { QueryKeys } from "@/lib/constants";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok) {
        return null;
      }

      const { user } = await response.json();

      return user;
    },
  });

  return query;
};
