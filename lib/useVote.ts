import useSWR from "swr";

export default function useVote(code: string) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, mutate, error } = useSWR<Res<Vote>>(
    code ? "/api/votes/" + code : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
  };
}
