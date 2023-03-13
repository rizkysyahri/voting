import { participant, Votes } from "@prisma/client";
import useSWR from "swr";

export default function useVote(code: string) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, mutate, error } = useSWR<Res<participant>>(
    code ? "/api/participant/" + code : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
  };
}
