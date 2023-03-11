import { Votes } from "@prisma/client";
import useSWR from "swr";

export default function useVote(code: string) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR<Res<Votes>>("/api/votes/" + code, fetcher);

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}
